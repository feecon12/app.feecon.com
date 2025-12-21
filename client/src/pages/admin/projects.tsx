// @ts-nocheck
import { Project } from "@/types";
import axios from "axios";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminProjectForm from "../../components/AdminProjectForm";
import { Layout } from "../../components/Layout";
import TransitionEffect from "../../components/TransitionEffect";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects`);
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (formData: Partial<Project>) => {
    try {
      const response = await axios.post(`${API_URL}/api/projects`, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Project created successfully!");
        setShowForm(false);
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  const handleUpdateProject = async (formData: Partial<Project>) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/projects/${editingProject._id}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Project updated successfully!");
        setEditingProject(null);
        setShowForm(false);
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await axios.delete(`${API_URL}/api/projects/${id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success("Project deleted successfully!");
        fetchProjects();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  return (
    <>
      <Head>
        <title>Admin - Manage Projects</title>
        <meta name="description" content="Manage your portfolio projects" />
      </Head>
      <TransitionEffect />
      <main className="w-full min-h-screen py-16">
        <Layout className="pt-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold dark:text-light">
                Manage Projects
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
                      setEditingProject(null);
                      setShowForm(true);
                    }}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all"
                  >
                    + Add Project
                  </button>
                )}
              </div>
            </div>

            {showForm && (
              <div className="mb-8">
                <AdminProjectForm
                  onSubmit={
                    editingProject ? handleUpdateProject : handleCreateProject
                  }
                  initialData={editingProject}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProject(null);
                  }}
                />
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-light dark:bg-dark p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.src = "/images/placeholder.jpg";
                      }}
                    />
                    <h3 className="text-xl font-bold mb-2 dark:text-light">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex gap-2 mb-4">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && projects.length === 0 && !showForm && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No projects yet. Click &quot;Add Project&quot; to create your
                first one!
              </div>
            )}
          </div>
        </Layout>
      </main>
    </>
  );
};

export default AdminProjects;
