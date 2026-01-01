// @ts-nocheck
import ImagePreview from "@/components/ImagePreview";
import { FormMessage } from "@/types";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";

interface AboutFormData {
  biography: string;
  profileImage: string;
  experience: string;
  clients: string;
  projectsCompleted: string;
  yearsOfExperience: string;
}

const AdminAbout: React.FC = () => {
  const [formData, setFormData] = useState<AboutFormData>({
    biography: "",
    profileImage: "",
    experience: "",
    clients: "",
    projectsCompleted: "",
    yearsOfExperience: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<FormMessage>({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await axios.get(urlConfig.GET_ABOUT);
      if (response.data.data) {
        setFormData({
          biography: response.data.data.biography || "",
          profileImage: response.data.data.profileImage || "",
          experience: response.data.data.experience || "",
          clients: response.data.data.clients || "",
          projectsCompleted: response.data.data.projectsCompleted || "",
          yearsOfExperience: response.data.data.yearsOfExperience || "",
        });
      }
      setFetchLoading(false);
    } catch (error) {
      console.error("Error fetching about:", error);
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
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(urlConfig.UPLOAD_IMAGE, formData, {
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
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(urlConfig.ABOUT, formData, {
        withCredentials: true,
      });

      setMessage({
        type: "success",
        text:
          response.data.message || "About information updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update about information",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Head>
          <title>Admin - About Management</title>
        </Head>
        <main className="w-full min-h-screen py-16">
          <Layout className="pt-16">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div className="h-10 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg border border-solid border-dark dark:border-light">
                {/* Biography skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                {/* Profile Image skeleton */}
                <div className="mb-6">
                  <div className="h-6 w-36 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                  <div className="w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                </div>
                {/* Stats skeleton */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
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
        <title>Admin - About Management</title>
      </Head>
      <main className="w-full min-h-screen py-16">
        <Layout className="pt-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-dark dark:text-light">
                Manage About Section
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
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100"
                    : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100"
                }`}
              >
                {message.text}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="bg-light dark:bg-dark p-8 rounded-2xl border border-solid border-dark dark:border-light shadow-xl"
            >
              <div className="mb-6">
                <label className="block text-dark dark:text-light font-medium mb-2">
                  Biography
                </label>
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-dark dark:text-light"
                  placeholder="Write your biography..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.biography.length}/2000 characters
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-dark dark:text-light font-medium mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-dark dark:text-light"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-primary mt-2">
                    Uploading image...
                  </p>
                )}
                {formData.profileImage && (
                  <div className="mt-4">
                    <ImagePreview
                      src={formData.profileImage}
                      alt="Profile preview"
                      onRemove={() =>
                        setFormData((prev) => ({ ...prev, profileImage: "" }))
                      }
                      width={160}
                      height={160}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-dark dark:text-light font-medium mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-dark dark:text-light"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block text-dark dark:text-light font-medium mb-2">
                    Clients
                  </label>
                  <input
                    type="text"
                    name="clients"
                    value={formData.clients}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-dark dark:text-light"
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <label className="block text-dark dark:text-light font-medium mb-2">
                    Projects Completed
                  </label>
                  <input
                    type="text"
                    name="projectsCompleted"
                    value={formData.projectsCompleted}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-dark dark:text-light"
                    placeholder="e.g., 200"
                  />
                </div>

                <div>
                  <label className="block text-dark dark:text-light font-medium mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-dark dark:text-light"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update About Information"}
              </button>
            </form>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default AdminAbout;
