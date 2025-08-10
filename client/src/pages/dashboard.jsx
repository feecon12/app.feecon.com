import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "../hooks/useAuthHooks";

const Dashboard = () => {
  const { user, getUserInfo, getUserRole, isAdmin, logout } = useSession();
  const userInfo = getUserInfo();
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <>
      <Head>
        <title>Dashboard | Feecon Behera</title>
        <meta name="description" content="User dashboard" />
      </Head>

      <ProtectedRoute requireAuth={true}>
        <main className="w-full flex flex-col items-center justify-center dark:text-light">
          <Layout className="pt-0 md:pt-16 sm:pt-8">
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-6xl font-bold mb-4 lg:text-5xl sm:text-4xl">
                  Welcome Back!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Here&apos;s your dashboard overview
                </p>
              </motion.div>

              {/* User Info Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-light dark:bg-dark border-2 border-primary rounded-lg p-8 max-w-md w-full shadow-lg"
              >
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-light">
                        {userInfo.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold">{userInfo.username}</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {userInfo.email}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-medium">Role:</span>
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

                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-medium">User ID:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {userInfo.id.slice(-8)}...
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={logout}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl"
              >
                <div
                  onClick={() => handleNavigation("/profile")}
                  className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md hover:border-primary transition-all cursor-pointer transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Profile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Manage your account
                  </p>
                </div>

                <div
                  onClick={() => handleNavigation("/settings")}
                  className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md hover:border-primary transition-all cursor-pointer transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Update preferences
                  </p>
                </div>

                <div
                  onClick={() => handleNavigation("/help")}
                  className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center hover:shadow-md hover:border-primary transition-all cursor-pointer transform hover:scale-105"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Help</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get support
                  </p>
                </div>
              </motion.div>
            </div>
          </Layout>
        </main>
      </ProtectedRoute>
    </>
  );
};

export default Dashboard;
