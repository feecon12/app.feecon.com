// @ts-nocheck
import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "../hooks/useAuthHooks";

interface EditData {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const { user, getUserInfo, getUserRole, isAdmin } = useSession();
  const userInfo = getUserInfo();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditData>({
    username: userInfo.username,
    email: userInfo.email,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Here you would typically make an API call to update user data
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      username: userInfo.username,
      email: userInfo.email,
    });
    setIsEditing(false);
  };

  return (
    <>
      <Head>
        <title>Profile | Feecon Behera</title>
        <meta name="description" content="User profile management" />
      </Head>

      <ProtectedRoute requireAuth={true}>
        <main className="w-full flex flex-col items-center justify-center dark:text-light">
          <Layout className="pt-0 md:pt-16 sm:pt-8">
            <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-6xl font-bold mb-4 lg:text-5xl sm:text-4xl">
                  My Profile
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Manage your account information
                </p>
              </motion.div>

              {/* Back to Dashboard Button */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="self-start mb-6"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center text-primary hover:text-primary-dark transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Dashboard
                </Link>
              </motion.div>

              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-light dark:bg-dark border-2 border-primary rounded-lg p-8 w-full max-w-2xl shadow-lg"
              >
                {/* Profile Avatar */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-light">
                      {userInfo.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <h2 className="text-3xl font-bold">{userInfo.username}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isAdmin()
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {getUserRole()}
                    </span>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username Field */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={editData.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {userInfo.username}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {userInfo.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* User ID (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      User ID
                    </label>
                    <p className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                      {userInfo.id}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveChanges}
                          className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg transition-colors font-medium"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Additional Options */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
              >
                <div className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">Change Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Update your account password
                  </p>
                  <button className="text-primary hover:text-primary-dark font-medium">
                    Change Password
                  </button>
                </div>

                <div className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Permanently delete your account
                  </p>
                  <button className="text-red-500 hover:text-red-600 font-medium">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </div>
          </Layout>
        </main>
      </ProtectedRoute>
    </>
  );
};

export default Profile;
