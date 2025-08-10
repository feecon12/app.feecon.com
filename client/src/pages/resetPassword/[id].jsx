import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
// import TransitionEffect from "@/components/TransitionEffect.js";
import URL from "@/utils/urlConfig";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fillForm from "../../../public/images/profile/herocontactpage.png";

const ResetPassword = () => {
  const router = useRouter();
  const { id: userId } = router.query;

  console.log("Router query:", router.query); // Debug log
  console.log("Router isReady:", router.isReady); // Debug log
  console.log("UserId from params:", userId); // Debug log

  const [formData, setFormData] = useState({
    token: "",
    password: "",
  });
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user came from forgot password flow
  useEffect(() => {
    if (!router.isReady) return; // Wait for router to be ready

    // Check for reset password session in sessionStorage
    const resetPasswordSession = sessionStorage.getItem("resetPasswordSession");
    const resetUserId = sessionStorage.getItem("resetUserId");

    if (!resetPasswordSession || resetUserId !== userId) {
      console.log("Unauthorized access attempt to reset password page");
      toast.error("Please use the forgot password to reset your password.");
      router.replace("/forgotPassword");
      return;
    }

    setIsAuthorized(true);
    setIsCheckingAuth(false);
  }, [router.isReady, userId, router]);

  // useEffect to handle userId when it's available
  useEffect(() => {
    if (!router.isReady || !isAuthorized) return; // Wait for router to be ready and authorization
    if (!userId) {
      console.log("No userId found in URL params");
      return;
    }
    // safe to use userId here
    console.log("Resetting password for user:", userId);
  }, [router.isReady, userId, isAuthorized]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Trigger validation on each input change
    validateForm({ ...formData, [name]: value });
  }

  function clearForm() {
    setFormData({
      token: "",
      password: "",
    });
    setIsValidated(false); // Reset validation
  }

  function validateForm(data) {
    const isFormValid = data.token && data.password;
    setIsValidated(isFormValid); // Button will be enabled if fields are filled
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidated) return; // Prevent submission if form is not valid

    // Check if userId is available
    if (!userId) {
      toast.error("Invalid reset link. Please try again from the email.");
      return;
    }

    setIsSubmitting(true); // Disable button while submitting

    //toast loading
    const toastId = toast.loading("Resetting password...");

    try {
      // Enhanced debugging logs
      console.log("Resetting password for userId:", userId);
      console.log("Form data being sent:", formData);
      console.log("Full API URL:", `${URL.RESET_PASSWORD}/${userId}`);

      const response = await axios.patch(`${URL.RESET_PASSWORD}/${userId}`, {
        ...formData,
        userId,
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200) {
        // Success toast
        toast.update(toastId, {
          render:
            response.data.message ||
            "Password reset successfully! Please login with your new password.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
        });
        setIsValidated(true);
        clearForm();
        console.log("Password reset successful:");

        // Clear the reset password session
        sessionStorage.removeItem("resetPasswordSession");
        sessionStorage.removeItem("resetUserId");

        router.push("/login");
      }
    } catch (error) {
      // Enhanced error logging
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.message);

      // Error toast
      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          error.response?.data?.error ||
          `Error resetting password. Status: ${
            error.response?.status || "Unknown"
          }`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
        closeOnClick: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <>
        <Head>
          <title>Feecon | Reset Password</title>
          <meta name="description" contents="any description" />
        </Head>
        <main className="w-full flex flex-col items-center justify-center dark:text-light">
          <Layout className="pt-0 md:pt-16 sm:pt-8">
            {isCheckingAuth ? (
              <div className="flex items-center justify-center w-full min-h-[50vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-lg">Verifying access...</p>
                </div>
              </div>
            ) : !isAuthorized ? (
              <div className="flex items-center justify-center w-full min-h-[50vh]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Unauthorized Access
                  </h2>
                  <p className="mb-4">
                    Please use the forgot password process to reset your
                    password.
                  </p>
                  <Link
                    href="/forgotPassword"
                    className="bg-primary text-light py-2 px-6 rounded-lg hover:bg-primary-dark"
                  >
                    Go to Forgot Password
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full lg:flex-col">
                <div className="w-1/2 md:w-full md:hidden">
                  <Image
                    src={fillForm}
                    alt="FME"
                    className="w-full h-auto lg:hidden md:inline-block md:w-full"
                    priority
                    sizes="(max-widthL768px) 100vw,
                   (max-width:1200px) 60vw,50vw"
                  />
                </div>

                <div className="w-1/2 flex flex-col px-10 py-5 self-center lg:w-full lg:text-center sm:px-0">
                  <div className="mb-6">
                    <h1 className="text-4xl font-bold mb-2">Reset Password?</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      Enter the 6-digit otp that sent to your email address and
                      enter the new password.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <fieldset className="capitalize">
                      <div>
                        <label htmlFor="token">6-Digit OTP</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="token"
                          required
                          maxLength="6"
                          pattern="[0-9]{6}"
                          placeholder="Enter 6-digit OTP"
                          value={formData.token}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="password">Password</label>
                      </div>
                      <div>
                        <input
                          type="password"
                          name="password"
                          required
                          placeholder="Enter New Password"
                          autoComplete="new-password"
                          value={formData.password}
                          onChange={handleChange}
                          className="border px-2 py-1 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={!isValidated || isSubmitting}
                          className="bg-primary text-light mt-2 py-2 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-primary border-2 border-solid hover:border-primary"
                        >
                          {isSubmitting
                            ? "Changing Password..."
                            : "Change Password"}
                        </button>
                      </div>
                    </fieldset>
                    <div className="text-sm mt-4">
                      <div>
                        <span>
                          Remember your password?{" "}
                          <Link
                            href="/login"
                            className="underline text-primary hover:text-primary-dark"
                          >
                            Back to Login
                          </Link>
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </Layout>
        </main>
      </>
    </ProtectedRoute>
  );
};

export default ResetPassword;
