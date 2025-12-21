import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";

const AdminHome = () => {
  const [formData, setFormData] = useState({
    heroText: "",
    bioParagraph: "",
    profileImage: "",
    resumeLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home`
      );
      if (response.data.data) {
        setFormData({
          heroText: response.data.data.heroText || "",
          bioParagraph: response.data.data.bioParagraph || "",
          profileImage: response.data.data.profileImage || "",
          resumeLink: response.data.data.resumeLink || "",
        });
      }
      setFetchLoading(false);
    } catch (error) {
      console.error("Error fetching home content:", error);
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home`,
        formData,
        {
          withCredentials: true,
        }
      );

      setMessage({
        type: "success",
        text: response.data.message || "Home content updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update home content",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Head>
          <title>Admin - Home Content Management</title>
        </Head>
        <main className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin - Home Content Management</title>
      </Head>
      <main className="w-full min-h-screen py-16">
        <Layout className="pt-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-dark dark:text-light">
                Manage Home Content
              </h1>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>

            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                {message.text}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg border border-solid border-dark dark:border-light"
            >
              <div className="mb-6">
                <label
                  htmlFor="heroText"
                  className="block text-lg font-medium mb-2 text-dark dark:text-light"
                >
                  Hero Text (Max 200 characters)
                </label>
                <input
                  type="text"
                  id="heroText"
                  name="heroText"
                  value={formData.heroText}
                  onChange={handleChange}
                  maxLength={200}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                  placeholder="Enter hero text (e.g., Bringing Dreams to Life...)"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.heroText.length}/200 characters
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="bioParagraph"
                  className="block text-lg font-medium mb-2 text-dark dark:text-light"
                >
                  Bio Paragraph (Max 1000 characters)
                </label>
                <textarea
                  id="bioParagraph"
                  name="bioParagraph"
                  value={formData.bioParagraph}
                  onChange={handleChange}
                  maxLength={1000}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light resize-none"
                  placeholder="Enter bio paragraph"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.bioParagraph.length}/1000 characters
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="profileImage"
                  className="block text-lg font-medium mb-2 text-dark dark:text-light"
                >
                  Profile Image URL
                </label>
                <input
                  type="url"
                  id="profileImage"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.profileImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Image Preview:
                    </p>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-solid border-dark dark:border-light">
                      <Image
                        src={formData.profileImage}
                        alt="Profile preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="resumeLink"
                  className="block text-lg font-medium mb-2 text-dark dark:text-light"
                >
                  Resume Link URL
                </label>
                <input
                  type="url"
                  id="resumeLink"
                  name="resumeLink"
                  value={formData.resumeLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/80"
                }`}
              >
                {loading ? "Updating..." : "Update Home Content"}
              </button>
            </form>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default AdminHome;
