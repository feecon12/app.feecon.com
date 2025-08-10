import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: false,
    },
    appearance: {
      theme: "auto", // auto, light, dark
      fontSize: "medium", // small, medium, large
    },
    privacy: {
      profileVisibility: "public", // public, private
      dataCollection: true,
    },
  });

  const handleNotificationChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically make an API call to save settings
    toast.success("Settings saved successfully!");
  };

  return (
    <>
      <Head>
        <title>Settings | Feecon Behera</title>
        <meta name="description" content="User settings and preferences" />
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
                  Settings
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Customize your preferences
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

              {/* Settings Sections */}
              <div className="w-full max-w-4xl space-y-8">
                {/* Notifications Settings */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-light dark:bg-dark border-2 border-primary rounded-lg p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Receive updates via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.email}
                          onChange={() => handleNotificationChange("email")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Push Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Receive push notifications in browser
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.push}
                          onChange={() => handleNotificationChange("push")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          Marketing Communications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Receive promotional emails and offers
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.marketing}
                          onChange={() => handleNotificationChange("marketing")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Appearance Settings */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-light dark:bg-dark border-2 border-primary rounded-lg p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Theme</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {["auto", "light", "dark"].map((theme) => (
                          <button
                            key={theme}
                            onClick={() =>
                              handleAppearanceChange("theme", theme)
                            }
                            className={`p-3 rounded-lg border-2 transition-all capitalize ${
                              settings.appearance.theme === theme
                                ? "border-primary bg-primary/10"
                                : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Font Size</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {["small", "medium", "large"].map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              handleAppearanceChange("fontSize", size)
                            }
                            className={`p-3 rounded-lg border-2 transition-all capitalize ${
                              settings.appearance.fontSize === size
                                ? "border-primary bg-primary/10"
                                : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Privacy Settings */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-light dark:bg-dark border-2 border-primary rounded-lg p-8 shadow-lg"
                >
                  <h2 className="text-2xl font-bold mb-6">Privacy</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Profile Visibility</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {["public", "private"].map((visibility) => (
                          <button
                            key={visibility}
                            onClick={() =>
                              handlePrivacyChange(
                                "profileVisibility",
                                visibility
                              )
                            }
                            className={`p-3 rounded-lg border-2 transition-all capitalize ${
                              settings.privacy.profileVisibility === visibility
                                ? "border-primary bg-primary/10"
                                : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
                            }`}
                          >
                            {visibility}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Data Collection</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Allow analytics and usage data collection
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.dataCollection}
                          onChange={() =>
                            handlePrivacyChange(
                              "dataCollection",
                              !settings.privacy.dataCollection
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={handleSaveSettings}
                    className="bg-primary hover:bg-primary-dark text-white py-3 px-8 rounded-lg transition-colors font-medium text-lg"
                  >
                    Save All Settings
                  </button>
                </motion.div>
              </div>
            </div>
          </Layout>
        </main>
      </ProtectedRoute>
    </>
  );
};

export default Settings;
