import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import TransitionEffect from "@/components/TransitionEffect";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "../hooks/useAuthHooks";

const Dashboard = () => {
  const { getUserInfo, logout } = useSession();
  const userInfo = getUserInfo();
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const contentManagementCards = [
    {
      title: "Home Content",
      description: "Manage hero text, bio & resume",
      path: "/admin/home",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "About Me",
      description: "Update bio and experience",
      path: "/admin/about",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Projects",
      description: "Manage portfolio projects",
      path: "/admin/projects",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      ),
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Skills",
      description: "Manage skills & certifications",
      path: "/admin/skills",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      ),
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard | Portfolio CMS</title>
        <meta name="description" content="Manage your portfolio content" />
      </Head>

      <ProtectedRoute requireAuth={true}>
        <TransitionEffect />
        <main className="w-full flex flex-col items-center justify-center dark:text-light">
          <Layout className="pt-0 md:pt-16 sm:pt-8">
            <div className="flex flex-col min-h-[70vh]">
              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-12"
              >
                <div>
                  <h1 className="text-5xl font-bold mb-2 lg:text-4xl sm:text-3xl">
                    Portfolio CMS
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Manage your portfolio content dynamically
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold">{userInfo.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Administrator
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>

              {/* Content Management Cards */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-6 mb-8"
              >
                {contentManagementCards.map((card, index) => (
                  <motion.div
                    key={card.path}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    onClick={() => handleNavigation(card.path)}
                    className="group relative overflow-hidden bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105 w-64 h-64 flex flex-col items-center justify-center"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                    />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                        <svg
                          className="w-8 h-8 text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {card.icon}
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {card.description}
                      </p>
                      <div className="mt-4 flex items-center justify-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Manage
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Info Banner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Dynamic Portfolio Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      All content you manage here will be automatically
                      displayed on your public portfolio pages. No login
                      required for visitors to view your portfolio.
                    </p>
                  </div>
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
