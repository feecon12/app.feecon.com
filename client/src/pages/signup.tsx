// @ts-nocheck
import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import fillForm from "../../public/images/svgs/signup.svg";
// import TransitionEffect from "../components/TransitionEffect";
import Head from "next/head";
import URL from "../utils/urlConfig";

interface SignupFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
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
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setIsValidated(false); // Reset validation
  }

  function validateForm(data: SignupFormData) {
    const isFormValid =
      data.username &&
      data.email &&
      data.phone &&
      data.password &&
      data.confirmPassword &&
      data.role &&
      data.password === data.confirmPassword;
    setIsValidated(isFormValid); // Button will be enabled if fields are filled
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidated) return; // Prevent submission if form is not valid

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsSubmitting(true); // Disable button while submitting

    //toast loading
    const toastId = toast.loading("Creating user...");

    try {
      // Make sure your API URL is correctly formatted (e.g., with a trailing slash)
      const response = await axios.post(URL.SIGNUP, formData);
      if (response.status === 201) {
        // Success toast
        toast.update(toastId, {
          render:
            response.data.message ||
            "Account created successfully! Please login to continue.",
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
        }); // Show success message
        setIsValidated(true); // Set the state to true
        clearForm(); // Clear form after successful submission
        console.log("Signup successful:");
        router.push("/login");
      }
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data || error.message
      );

      // Error toast
      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          "Error during signup. Please try again later.",
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
          <title>Feecon | Sign Up</title>
          <meta name="description" contents="any description" />
        </Head>
        <main className="w-full flex flex-col items-center justify-center dark:text-light">
          <Layout className="pt-0 md:pt-16 sm:pt-8">
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
                  <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Join us today! Please fill in the details to create your
                    account.
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <fieldset className="capitalize">
                    <div>
                      <label htmlFor="username">Username</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </div>
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
                      <label htmlFor="phone">Phone</label>
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
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
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    <div>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="role">Role</label>
                    </div>
                    <div>
                      <select
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded-lg focus:outline-none"
                      >
                        <option value="">Select a role</option>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={!isValidated || isSubmitting}
                        className="bg-primary text-light mt-2 py-2 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-primary border-2 border-solid hover:border-primary"
                      >
                        {isSubmitting ? "Creating Account..." : "Sign Up"}
                      </button>
                    </div>
                  </fieldset>
                  <div className="text-sm mt-4">
                    <div>
                      <span>
                        Already have an account?{" "}
                        <Link
                          href={"/login"}
                          className="underline text-primary hover:text-primary-dark"
                        >
                          Login here
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

export default Signup;
