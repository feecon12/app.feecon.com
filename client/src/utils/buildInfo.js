// Build information utilities
export const getBuildInfo = () => {
  // This will be populated during build time
  return {
    lastUpdated:
      process.env.NEXT_PUBLIC_LAST_UPDATED || new Date().toISOString(),
    buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
  };
};

export const formatLastUpdated = (dateString) => {
  try {
    const date = new Date(dateString);

    // Format: DD/MM/YYYY, HH:MM (24-hour format)
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${month}/${day}/${year}, ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown";
  }
};
