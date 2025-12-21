import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import TransitionEffect from "@/components/TransitionEffect";
import { User } from "@/types";
import { motion } from "framer-motion";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useSession } from "../hooks/useAuthHooks";

interface ContentCard {
  title: string;
  description: string;
  path: string;
  icon: ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const { getUserInfo, logout } = useSession();
  const userInfo: User | null = getUserInfo();
  const router = useRouter();

  const handleNavigation = (path: string): void => {
    router.push(path);
  };

  const contentManagementCards: ContentCard[] = [
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
        <meta
          name="description"
          content="Content Management System for Portfolio"
        />
      </Head>
      <TransitionEffect />
      <ProtectedRoute>
        <main className="flex w-full flex-col items-center justify-center min-h-screen dark:text-light bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <Layout className="pt-16">
            {/* Header Section */}
            <div className="text-center mb-12">
              <motion.h1
                className="text-5xl font-bold text-dark dark:text-light mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Portfolio CMS Dashboard
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome back,{" "}
                <span className="font-semibold text-primary">
                  {userInfo?.username || "Admin"}
                </span>
                !
              </motion.p>
            </div>

            {/* Content Management Cards */}
            <div className="flex flex-row flex-wrap justify-center items-center gap-8 w-full max-w-6xl mx-auto">
              {contentManagementCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(card.path)}
                  className={`relative cursor-pointer w-64 h-64 p-8 rounded-2xl bg-gradient-to-br ${card.color} text-light shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent)]"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Icon */}
                    <div className="mb-4">
                      <svg
                        className="w-12 h-12 transform group-hover:rotate-12 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {card.icon}
                      </svg>
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-300">
                        {card.title}
                      </h3>
                      <p className="text-light/80 text-sm group-hover:translate-x-1 transition-transform duration-300">
                        {card.description}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute bottom-6 right-6 transform translate-x-8 group-hover:translate-x-0 transition-transform duration-300">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <motion.div
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                { label: "Total Sections", value: "4", icon: "📊" },
                { label: "Last Updated", value: "Today", icon: "📅" },
                { label: "Status", value: "Active", icon: "✅" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-light dark:bg-dark p-6 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-dark dark:text-light mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </Layout>
        </main>
      </ProtectedRoute>
    </>
  );
};

export default Dashboard;
