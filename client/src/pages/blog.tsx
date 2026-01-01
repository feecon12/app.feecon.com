// @ts-nocheck
import { AnimatedText } from "@/components/AnimatedText";
import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect";
import { Blog } from "@/types";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
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
        <meta
          name="keywords"
          content="Feecon, blog, tech articles, web development, programming, software engineering, insights"
        />
        <meta property="og:title" content="Blog | Tech Articles & Insights" />
        <meta
          property="og:description"
          content="Read tech articles and insights on web development, programming, and software engineering"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://app.feecon.com/blog" />
        <meta
          property="og:image"
          content="https://app.feecon.com/images/logo/feecon-og.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Tech Articles & Insights" />
        <meta
          name="twitter:description"
          content="Read tech articles and insights on web development, programming, and software engineering"
        />
        <meta
          name="twitter:image"
          content="https://app.feecon.com/images/logo/feecon-og.png"
        />
      </Head>
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText
            text="Tech Articles & Insights"
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"
          />

          {loading ? (
            <div className="grid grid-cols-12 gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
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
            <div className="grid grid-cols-12 gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
              {blogs.map((blog) => (
                <motion.article
                  key={blog._id}
                  className="col-span-12 sm:col-span-12 md:col-span-6  flex flex-col justify-between bg-light dark:bg-dark border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push(`/blog/${blog._id}`)}
                >
                  {blog.image && (
                    <div className="col-span-12">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={600}
                        height={192}
                        className="w-full h-48 object-cover"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "12rem",
                        }}
                        priority={false}
                        unoptimized={
                          typeof blog.image === "string" &&
                          blog.image.startsWith("http")
                        }
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
