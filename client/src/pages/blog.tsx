// @ts-nocheck
import AnimatedText from "@/components/AnimatedText";
import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect";
import { Blog } from "@/types";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(urlConfig.GET_PUBLISHED_BLOGS);
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <>
      <Head>
        <title>Blog | Tech Articles & Insights</title>
        <meta
          name="description"
          content="Read tech articles and insights on web development, programming, and software engineering"
        />
      </Head>
      <TransitionEffect />
      <main className="w-full min-h-screen py-16 dark:text-light">
        <Layout className="pt-16">
          <AnimatedText
            text="Tech Articles & Insights"
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-6 h-64"
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No blog posts published yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <motion.article
                  key={blog._id}
                  className="bg-light dark:bg-dark border border-solid border-dark dark:border-light rounded-lg p-6 hover:shadow-xl transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push(`/blog/${blog._id}`)}
                >
                  {blog.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                    {blog.title}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>By {blog.author?.username || "Admin"}</span>
                    <span>•</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.summary || truncateContent(blog.content)}
                  </p>

                  <button className="text-primary hover:underline font-medium">
                    Read More →
                  </button>
                </motion.article>
              ))}
            </div>
          )}
        </Layout>
      </main>
    </>
  );
};

export default BlogPage;
