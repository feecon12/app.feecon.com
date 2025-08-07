import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const Help = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the message to your support system
    toast.success("Your message has been sent! We'll get back to you soon.");
    setContactForm({ subject: "", message: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const faqData = [
    {
      question: "How do I change my password?",
      answer:
        "Go to your Profile page and click on 'Change Password'. You'll need to enter your current password and then your new password twice.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Navigate to the Profile page from your dashboard and click 'Edit Profile'. You can update your username and email address.",
    },
    {
      question: "How do I change notification settings?",
      answer:
        "Visit the Settings page and adjust your notification preferences in the Notifications section.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account from the Profile page. Please note that this action is permanent and cannot be undone.",
    },
    {
      question: "How do I reset my password if I forgot it?",
      answer:
        "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <>
      <Head>
        <title>Help & Support | Feecon Behera</title>
        <meta name="description" content="Help and support center" />
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
                  Help & Support
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Get the help you need
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

              {/* Tab Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8"
              >
                <button
                  onClick={() => setActiveTab("faq")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === "faq"
                      ? "bg-primary text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === "contact"
                      ? "bg-primary text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  Contact Support
                </button>
                <button
                  onClick={() => setActiveTab("resources")}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    activeTab === "resources"
                      ? "bg-primary text-white"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary"
                  }`}
                >
                  Resources
                </button>
              </motion.div>

              {/* Tab Content */}
              <div className="w-full max-w-4xl">
                {/* FAQ Tab */}
                {activeTab === "faq" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold mb-6">
                      Frequently Asked Questions
                    </h2>
                    {faqData.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedFaq(expandedFaq === index ? null : index)
                          }
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex justify-between items-center"
                        >
                          <span className="font-semibold">{faq.question}</span>
                          <svg
                            className={`w-5 h-5 transition-transform ${
                              expandedFaq === index ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {expandedFaq === index && (
                          <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-light dark:bg-dark border-2 border-primary rounded-lg p-8 shadow-lg">
                      <h2 className="text-2xl font-bold mb-6">
                        Contact Support
                      </h2>
                      <form
                        onSubmit={handleContactSubmit}
                        className="space-y-6"
                      >
                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium mb-2"
                          >
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={contactForm.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                            placeholder="Brief description of your issue"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium mb-2"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={contactForm.message}
                            onChange={handleInputChange}
                            required
                            rows="6"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                            placeholder="Describe your issue in detail..."
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg transition-colors font-medium"
                        >
                          Send Message
                        </button>
                      </form>

                      {/* Contact Info */}
                      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold mb-4">
                          Other Ways to Reach Us
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <p>📧 Email: support@feecon.com</p>
                          <p>📞 Phone: +1 (555) 123-4567</p>
                          <p>⏰ Hours: Monday-Friday, 9AM-5PM EST</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Resources Tab */}
                {activeTab === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-bold mb-6">
                      Resources & Documentation
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                          <h3 className="font-semibold">User Guide</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Comprehensive guide on how to use all features
                        </p>
                        <button className="text-primary hover:text-primary-dark font-medium">
                          View Guide →
                        </button>
                      </div>

                      <div className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-semibold">Video Tutorials</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Step-by-step video walkthroughs
                        </p>
                        <button className="text-primary hover:text-primary-dark font-medium">
                          Watch Videos →
                        </button>
                      </div>

                      <div className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-semibold">Community Forum</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Connect with other users and get help
                        </p>
                        <button className="text-primary hover:text-primary-dark font-medium">
                          Join Forum →
                        </button>
                      </div>

                      <div className="bg-light dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-semibold">API Documentation</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Technical documentation for developers
                        </p>
                        <button className="text-primary hover:text-primary-dark font-medium">
                          Read Docs →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Layout>
        </main>
      </ProtectedRoute>
    </>
  );
};

export default Help;
