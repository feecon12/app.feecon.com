// @ts-nocheck
import { Project } from "@/types";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface ProjectFormData {
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  image: string;
}

interface AdminProjectFormProps {
  onSubmit: (data: Partial<Project>) => Promise<void>;
  initialData?: Project | null;
  onCancel: () => void;
}

const AdminProjectForm: React.FC<AdminProjectFormProps> = ({
  onSubmit,
  initialData = null,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    projectUrl: initialData?.liveLink || "",
    githubUrl: initialData?.githubLink || "",
    image: initialData?.image || "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Map form data to Project interface format
    const projectData = {
      title: formData.title,
      description: formData.description,
      liveLink: formData.projectUrl,
      githubLink: formData.githubUrl,
      image: formData.image,
    };
    await onSubmit(projectData);
    setLoading(false);
  };

  return (
    // @ts-ignore - framer-motion types issue
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg border border-solid border-dark dark:border-light"
    >
      <h2 className="text-2xl font-bold mb-6 dark:text-light">
        {initialData ? "Edit Project" : "Add New Project"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
            placeholder="My Awesome Project"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light resize-none"
            placeholder="Describe your project..."
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formData.description.length}/1000 characters
          </p>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Project URL
          </label>
          <input
            type="url"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
            placeholder="https://myproject.com"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            GitHub URL
          </label>
          <input
            type="url"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2 text-dark dark:text-light">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Image Preview:
              </p>
              <img
                src={formData.image}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg border-2 border-solid border-gray-300 dark:border-gray-600"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
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
              ? "Update Project"
              : "Create Project"}
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

export default AdminProjectForm;
