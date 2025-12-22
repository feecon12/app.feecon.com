// @ts-nocheck
import { Blog } from "@/types";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminBlogForm from "../../components/AdminBlogForm";
import { Layout } from "../../components/Layout";
import TransitionEffect from "../../components/TransitionEffect";

const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(urlConfig.GET_BLOGS, {
        withCredentials: true,
      });
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (formData: Partial<Blog>) => {
    try {
      const response = await axios.post(urlConfig.BLOGS, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Blog post created successfully!");
        setShowForm(false);
        fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog post");
    }
  };

  const handleUpdateBlog = async (formData: Partial<Blog>) => {
    try {
      const response = await axios.patch(
        `${urlConfig.BLOGS}/${editingBlog._id}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Blog post updated successfully!");
        setEditingBlog(null);
        setShowForm(false);
        fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update blog post");
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const response = await axios.delete(`${urlConfig.BLOGS}/${id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Blog post deleted successfully!");
        fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog post");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Head>
        <title>Admin - Manage Blog Posts</title>
        <meta name="description" content="Manage your blog posts" />
      </Head>
      <TransitionEffect />
      <main className="w-full min-h-screen py-16">
        <Layout className="pt-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold dark:text-light">
                Manage Blog Posts
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Dashboard
                </button>
                {!showForm && (
                  <button
                    onClick={() => {
                      setEditingBlog(null);
                      setShowForm(true);
                    }}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all"
                  >
                    + Add Blog Post
                  </button>
                )}
              </div>
            </div>

            {showForm && (
              <div className="mb-8">
                <AdminBlogForm
                  onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
                  initialData={editingBlog}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingBlog(null);
                  }}
                />
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-48"
                  >
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20 bg-light dark:bg-dark rounded-lg border border-solid border-dark dark:border-light">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  No blog posts yet
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all"
                >
                  Create Your First Blog Post
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <motion.article
                    key={blog._id}
                    className="bg-light dark:bg-dark border border-solid border-dark dark:border-light rounded-lg p-6 hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold dark:text-light line-clamp-2 flex-1">
                        {blog.title}
                      </h2>
                      <span
                        className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full ${
                          blog.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>{formatDate(blog.createdAt)}</span>
                      {blog.updatedAt !== blog.createdAt && (
                        <span className="ml-2">
                          (Updated: {formatDate(blog.updatedAt)})
                        </span>
                      )}
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {blog.summary || truncateContent(blog.content)}
                    </p>

                    <div className="flex gap-3 pt-3 border-t border-gray-300 dark:border-gray-700">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => router.push(`/blog/${blog._id}`)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </Layout>
      </main>
    </>
  );
};

export default AdminBlogs;
