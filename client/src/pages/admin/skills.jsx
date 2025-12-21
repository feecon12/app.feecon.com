import axios from "axios";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    x: "",
    y: "",
    order: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/skills`
      );
      setSkills(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      if (editingId) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${editingId}`,
          formData,
          { withCredentials: true }
        );
        setMessage({ type: "success", text: "Skill updated successfully!" });
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/skills`,
          formData,
          { withCredentials: true }
        );
        setMessage({ type: "success", text: "Skill created successfully!" });
      }
      setFormData({ name: "", x: "", y: "", order: 0 });
      setEditingId(null);
      fetchSkills();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Operation failed",
      });
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      x: skill.x,
      y: skill.y,
      order: skill.order,
    });
    setEditingId(skill._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/skills/${id}`,
        { withCredentials: true }
      );
      setMessage({ type: "success", text: "Skill deleted successfully!" });
      fetchSkills();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Delete failed",
      });
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", x: "", y: "", order: 0 });
    setEditingId(null);
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Admin - Skills Management</title>
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
        <title>Admin - Skills Management</title>
      </Head>
      <main className="w-full min-h-screen py-16">
        <Layout className="pt-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-dark dark:text-light">
                Manage Skills
              </h1>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>

            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                {message.text}
              </motion.div>
            )}

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg border border-solid border-dark dark:border-light mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-dark dark:text-light">
                {editingId ? "Edit Skill" : "Add New Skill"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-dark dark:text-light">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={50}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-dark dark:text-light">
                    X Position (e.g., -20vw, 15vw)
                  </label>
                  <input
                    type="text"
                    name="x"
                    value={formData.x}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                    placeholder="e.g., -20vw"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-dark dark:text-light">
                    Y Position (e.g., 10vw, -15vw)
                  </label>
                  <input
                    type="text"
                    name="y"
                    value={formData.y}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                    placeholder="e.g., 10vw"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2 text-dark dark:text-light">
                    Order (lower number appears first)
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-light dark:bg-dark text-dark dark:text-light"
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors bg-primary hover:bg-primary/80"
                  >
                    {editingId ? "Update Skill" : "Add Skill"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Skills List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-dark dark:text-light mb-4">
                Current Skills ({skills.length})
              </h2>
              {skills.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No skills added yet. Add your first skill above.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-light dark:bg-dark p-6 rounded-lg border border-gray-300 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-dark dark:text-light">
                          {skill.name}
                        </h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Order: {skill.order}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <p>
                          Position: x={skill.x}, y={skill.y}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id)}
                          className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default AdminSkills;
