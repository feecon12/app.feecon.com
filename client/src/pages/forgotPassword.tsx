// @ts-nocheck
import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import fillForm from "../../public/images/svgs/forgotPassword.svg";
import URL from "../utils/urlConfig";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      email: "",
    });
    setIsValidated(false); // Reset validation
  }

  function validateForm(data: ForgotPasswordFormData) {
    const isFormValid = data.email;
    setIsValidated(isFormValid); // Button will be enabled if fields are filled
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidated) return; // Prevent submission if form is not valid

    setIsSubmitting(true); // Disable button while submitting

    //toast loading
    const toastId = toast.loading("Sending reset link...");

    try {
      // Make sure your API URL is correctly formatted (e.g., with a trailing slash)
      const response = await axios.post(URL.FORGOT_PASSWORD, formData);
      const userId = response.data.userId;

      if (response.status === 200) {
        // Success toast
        toast.update(toastId, {
          render:
            response.data.message ||
            "Reset link sent to your email successfully!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
          closeOnClick: true,
        }); // Show success message
        setIsValidated(true); // Set the state to true
        clearForm(); // Clear form after successful submission
        console.log("Reset link sent successfully:");

        // Set session to allow access to reset password page
        sessionStorage.setItem("resetPasswordSession", "true");
        sessionStorage.setItem("resetUserId", userId);

        // Don't redirect immediately - let user check their email
        router.push(`/resetPassword/${userId}`);
      }
    } catch (error) {
      console.error(
        "Error sending reset link:",
        error.response?.data || error.message
      );

      // Error toast
      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          "Error sending reset link. Please try again later.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
      });
    } finally {                
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <>
        <Head>
          <title>Feecon | Forgot Password</title>
          <meta name="description" contents="any description" />
        </Head>
        <main className="w-full flex flex-col items-center justify-center dark:text-light">
          <Layout className="pt-0 md:pt-16 sm:pt-8">
            <div className="flex items-center justify-between w-full lg:flex-col">
              <div className="w-1/2 md:w-full md:hidden">
                <Image
                  src={fillForm}
                  alt="FME"
                  className="w-full h-auto lg:hidden md:inline-block md:w-full transform -scale-x-100"
                  priority
                  sizes="(max-widthL768px) 100vw,
                 (max-width:1200px) 60vw,50vw"
                />
              </div>
              <div className="w-1/2 flex flex-col px-10 py-5 self-center lg:w-full lg:text-center sm:px-0">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold mb-2">Forgot Password?</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <fieldset className="capitalize">
                    <div>
                      <label htmlFor="email">Email</label>
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
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
                        {isSubmitting ? "Sending..." : "Send OTP"}
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
          </Layout>
        </main>
      </>
    </ProtectedRoute>
  );
};

export default ForgotPassword;
