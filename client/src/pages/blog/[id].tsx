// @ts-nocheck
import { AnimatedText } from "@/components/AnimatedText";
import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect";
import { Blog } from "@/types";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BlogDetailPage: React.FC = () => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${urlConfig.BLOGS}/${id}`);
      if (response.data.success) {
        setBlog(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch blog post");
      router.push("/blog");
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

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <TransitionEffect />
        <main className="w-full min-h-screen py-16 dark:text-light">
          <Layout className="pt-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Layout>
        </main>
      </>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{blog.title} | Blog</title>
        <meta
          name="description"
          content={blog.summary || blog.content.substring(0, 160)}
        />
      </Head>
      <TransitionEffect />
      <main className="w-full min-h-screen py-16 dark:text-light">
        <Layout className="pt-16">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push("/blog")}
              className="mb-6 text-primary hover:underline flex items-center gap-2"
            >
              ← Back to Blog
            </button>

            <AnimatedText
              text={blog.title}
              className="mb-8 lg:!text-5xl sm:mb-6 sm:!text-4xl xs:!text-3xl"
            />

            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <span className="font-medium">
                By {blog.author?.username || "Admin"}
              </span>
              <span>•</span>
              <span>{formatDate(blog.createdAt)}</span>
              {blog.updatedAt !== blog.createdAt && (
                <>
                  <span>•</span>
                  <span className="text-sm">
                    Updated: {formatDate(blog.updatedAt)}
                  </span>
                </>
              )}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {blog.image && (
              <div className="mb-8 overflow-hidden rounded-lg">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {blog.summary && (
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-3">Summary</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {blog.summary}
                </p>
              </div>
            )}

            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                {blog.content}
              </div>
            </article>

            <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
              <button
                onClick={() => router.push("/blog")}
                className="text-primary hover:underline flex items-center gap-2 font-medium"
              >
                ← Back to All Posts
              </button>
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default BlogDetailPage;
