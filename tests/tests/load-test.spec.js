const { test, expect } = require("@playwright/test");
const fs = require("fs");

// Configuration
const CONFIG = {
  baseUrl: process.env.API_URL || "http://localhost:5000",
  concurrentUsers: 10, // How many virtual users to simulate
  iterations: 5, // How many requests each user will make
  delayBetweenRequests: 100, // ms between requests (per user)
  endpoints: [
    { method: "GET", path: "/api/products" },
    { method: "GET", path: "/api/products/featured" },
    // Add more endpoints as needed
  ],
  authEndpoint: "/api/auth/login",
  authCredentials: {
    email: "mail2feeconbehera@gmail.com",
    password: "India@12198", // Use test account credentials
  },
};

// Results storage
const results = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  endpoints: {},
  errors: [],
  timing: {
    start: 0,
    end: 0,
    duration: 0,
  },
  responseTimeSummary: {
    min: Number.MAX_SAFE_INTEGER,
    max: 0,
    avg: 0,
    median: 0,
    p95: 0,
    p99: 0,
  },
};

test("API Load Test", async ({ request }) => {
  results.timing.start = Date.now();
  let authToken = null;

  // Get auth token first
  try {
    const authResponse = await request.post(
      `${CONFIG.baseUrl}${CONFIG.authEndpoint}`,
      {
        data: CONFIG.authCredentials,
      }
    );

    expect(authResponse.ok()).toBeTruthy();
    const authData = await authResponse.json();
    authToken = authData.token;
    console.log("Authentication successful");
  } catch (error) {
    console.error("Authentication failed:", error);
    throw new Error("Could not authenticate for load test");
  }

  // Initialize results structure for each endpoint
  CONFIG.endpoints.forEach((endpoint) => {
    results.endpoints[endpoint.path] = {
      requests: 0,
      successful: 0,
      failed: 0,
      responseTimes: [],
    };
  });

  // Create an array of user simulation promises
  const userSimulations = [];

  for (let user = 0; user < CONFIG.concurrentUsers; user++) {
    userSimulations.push(simulateUser(request, authToken, user));
  }

  // Wait for all user simulations to complete
  await Promise.all(userSimulations);

  results.timing.end = Date.now();
  results.timing.duration = results.timing.end - results.timing.start;

  // Calculate statistics
  calculateStatistics();

  // Output results
  const timestamp = new Date().toISOString().replace(/:/g, "-");
  fs.writeFileSync(
    `api-load-test-results-${timestamp}.json`,
    JSON.stringify(results, null, 2)
  );

  // Print summary
  console.log("\n==== Load Test Results ====");
  console.log(`Total Duration: ${results.timing.duration / 1000}s`);
  console.log(`Total Requests: ${results.totalRequests}`);
  console.log(
    `Successful: ${results.successfulRequests} (${(
      (results.successfulRequests / results.totalRequests) *
      100
    ).toFixed(2)}%)`
  );
  console.log(
    `Failed: ${results.failedRequests} (${(
      (results.failedRequests / results.totalRequests) *
      100
    ).toFixed(2)}%)`
  );
  console.log("\nResponse Times (ms):");
  console.log(`  Min: ${results.responseTimeSummary.min}`);
  console.log(`  Max: ${results.responseTimeSummary.max}`);
  console.log(`  Avg: ${results.responseTimeSummary.avg.toFixed(2)}`);
  console.log(`  Median: ${results.responseTimeSummary.median}`);
  console.log(`  95th percentile: ${results.responseTimeSummary.p95}`);
  console.log(`  99th percentile: ${results.responseTimeSummary.p99}`);

  console.log("\nEndpoint Performance:");
  Object.keys(results.endpoints).forEach((endpoint) => {
    const ep = results.endpoints[endpoint];
    if (ep.requests > 0) {
      const avgTime =
        ep.responseTimes.reduce((a, b) => a + b, 0) / ep.responseTimes.length;
      console.log(
        `  ${endpoint}: ${ep.successful}/${
          ep.requests
        } successful, avg: ${avgTime.toFixed(2)}ms`
      );
    }
  });

  // Validate test results
  expect(results.failedRequests / results.totalRequests).toBeLessThan(0.05); // Less than 5% failure rate
  expect(results.responseTimeSummary.p95).toBeLessThan(2000); // 95% of requests under 2 seconds
});

// Function to simulate a single user's behavior
async function simulateUser(request, authToken, userId) {
  for (let i = 0; i < CONFIG.iterations; i++) {
    // Randomly select an endpoint to test
    const endpointIndex = Math.floor(Math.random() * CONFIG.endpoints.length);
    const endpoint = CONFIG.endpoints[endpointIndex];

    try {
      const startTime = Date.now();
      let response;

      // Make the request based on the method
      if (endpoint.method === "GET") {
        response = await request.get(`${CONFIG.baseUrl}${endpoint.path}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else if (endpoint.method === "POST") {
        response = await request.post(`${CONFIG.baseUrl}${endpoint.path}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          data: endpoint.data || {},
        });
      }

      const responseTime = Date.now() - startTime;

      // Update results
      results.totalRequests++;
      results.endpoints[endpoint.path].requests++;
      results.endpoints[endpoint.path].responseTimes.push(responseTime);

      if (response.ok()) {
        results.successfulRequests++;
        results.endpoints[endpoint.path].successful++;
      } else {
        results.failedRequests++;
        results.endpoints[endpoint.path].failed++;
        results.errors.push({
          endpoint: endpoint.path,
          statusCode: response.status(),
          statusText: response.statusText(),
          userId,
          iteration: i,
        });
      }
    } catch (error) {
      results.totalRequests++;
      results.failedRequests++;
      results.endpoints[endpoint.path].requests++;
      results.endpoints[endpoint.path].failed++;
      results.errors.push({
        endpoint: endpoint.path,
        error: error.message,
        userId,
        iteration: i,
      });
    }

    // Add delay between requests
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.delayBetweenRequests)
    );
  }
}

// Calculate statistical measurements from the collected data
function calculateStatistics() {
  // Collect all response times
  let allResponseTimes = [];

  Object.values(results.endpoints).forEach((endpoint) => {
    allResponseTimes = allResponseTimes.concat(endpoint.responseTimes);
  });

  if (allResponseTimes.length === 0) return;

  // Sort for percentile calculations
  allResponseTimes.sort((a, b) => a - b);

  // Calculate min, max, average
  results.responseTimeSummary.min = allResponseTimes[0];
  results.responseTimeSummary.max =
    allResponseTimes[allResponseTimes.length - 1];
  results.responseTimeSummary.avg =
    allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length;

  // Calculate median (50th percentile)
  const medianIndex = Math.floor(allResponseTimes.length / 2);
  results.responseTimeSummary.median = allResponseTimes[medianIndex];

  // Calculate 95th percentile
  const p95Index = Math.floor(allResponseTimes.length * 0.95);
  results.responseTimeSummary.p95 = allResponseTimes[p95Index];

  // Calculate 99th percentile
  const p99Index = Math.floor(allResponseTimes.length * 0.99);
  results.responseTimeSummary.p99 = allResponseTimes[p99Index];
}
