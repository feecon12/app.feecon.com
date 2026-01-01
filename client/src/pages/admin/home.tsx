// @ts-nocheck
import ImagePreview from "@/components/ImagePreview";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import Head from "next/head";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await axios.get(urlConfig.GET_HOME);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append("image", file);

      try {
        const response = await axios.post(urlConfig.UPLOAD_IMAGE, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            profileImage: response.data.data.url,
          }));
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setMessage({ type: "error", text: "Failed to upload image" });
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingResume(true);
      const uploadData = new FormData();
      uploadData.append("resume", file);

      try {
        const response = await axios.post(urlConfig.UPLOAD_RESUME, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (response.data.success) {
          setFormData((prev) => ({
            ...prev,
            resumeLink: response.data.data.url,
          }));
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setMessage({ type: "error", text: "Failed to upload resume" });
      } finally {
        setUploadingResume(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(urlConfig.HOME, formData, {
        withCredentials: true,
      });

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
        <main className="w-full min-h-screen py-16">
          <Layout className="pt-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="h-10 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg border border-solid border-dark dark:border-light">
                {/* Hero Text skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                {/* Bio skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-56 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-32 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                {/* Image skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-36 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                  <div className="w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                </div>
                {/* Resume skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                {/* Button skeleton */}
                <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </Layout>
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
                onClick={() => router.push("/admin/dashboard")}
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
                  Profile Image
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                />
                {uploadingImage && (
                  <p className="text-sm text-primary mt-2">
                    Uploading image...
                  </p>
                )}
                {formData.profileImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Image Preview:
                    </p>
                    <ImagePreview
                      src={formData.profileImage}
                      alt="Profile preview"
                      onRemove={() =>
                        setFormData((prev) => ({ ...prev, profileImage: "" }))
                      }
                      width={160}
                      height={160}
                      rounded="full"
                      className="w-40 h-40"
                    />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="resumeLink"
                  className="block text-lg font-medium mb-2 text-dark dark:text-light"
                >
                  Resume (PDF)
                </label>
                <input
                  type="file"
                  id="resumeLink"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  disabled={uploadingResume}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                />
                {uploadingResume && (
                  <p className="text-sm text-primary mt-2">
                    Uploading resume...
                  </p>
                )}
                {formData.resumeLink && (
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Current:{" "}
                      <a
                        href={formData.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        View Resume
                      </a>
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, resumeLink: "" }))
                      }
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
                      title="Remove resume"
                    >
                      ✕
                    </button>
                  </div>
                )}
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
