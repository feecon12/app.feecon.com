// @ts-nocheck
import { Blog } from "@/types";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import ImagePreview from "./ImagePreview";

interface BlogFormData {
  title: string;
  content: string;
  summary: string;
  tags: string;
  published: boolean;
  image: string;
}

interface AdminBlogFormProps {
  onSubmit: (data: Partial<Blog>) => Promise<void>;
  initialData?: Blog | null;
  onCancel: () => void;
}

const AdminBlogForm: React.FC<AdminBlogFormProps> = ({
  onSubmit,
  initialData = null,
  onCancel,
}) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    summary: initialData?.summary || "",
    tags: initialData?.tags?.join(", ") || "",
    published: initialData?.published || false,
    image: initialData?.image || "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setFormData((prev) => ({ ...prev, image: response.data.data.url }));
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload image");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Convert comma-separated tags string to array
    const tagsArray = formData.tags
      ? formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const blogData = {
      title: formData.title,
      content: formData.content,
      summary: formData.summary,
      tags: tagsArray,
      published: formData.published,
      image: formData.image,
    };

    await onSubmit(blogData);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg border border-solid border-dark dark:border-light"
    >
      <h2 className="text-2xl font-bold mb-6 dark:text-light">
        {initialData ? "Edit Blog Post" : "Create New Blog Post"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
            placeholder="Enter blog title"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formData.title.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Summary (Optional)
          </label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            maxLength={500}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light resize-none"
            placeholder="Brief summary of the blog post..."
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formData.summary.length}/500 characters
          </p>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light resize-none font-mono text-sm"
            placeholder="Write your blog content here..."
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
            placeholder="React, TypeScript, Web Development"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Separate tags with commas
          </p>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Featured Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-primary mt-2">Uploading image...</p>
          )}
          {formData.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Image Preview:
              </p>
              <ImagePreview
                src={formData.image}
                alt="Preview"
                onRemove={() => setFormData((prev) => ({ ...prev, image: "" }))}
                width={300}
                height={200}
                className="w-full max-w-md h-48"
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label className="ml-3 text-lg font-medium text-dark dark:text-light">
            Publish immediately
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/80"
            }`}
          >
            {loading
              ? "Saving..."
              : initialData
              ? "Update Blog Post"
              : "Create Blog Post"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default AdminBlogForm;
