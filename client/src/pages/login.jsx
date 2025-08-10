import { Layout } from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import fillForm from "../../public/images/svgs/login.svg";
import { useAuth } from "../contexts/AuthContext";
import Head from "next/head";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      email: "",
      password: "",
    });
    setIsValidated(false); // Reset validation
  }

  function validateForm(data) {
    const isFormValid = data.email && data.password;
    setIsValidated(isFormValid); // Button will be enabled if fields are filled
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidated) return; // Prevent submission if form is not valid

    setIsSubmitting(true); // Disable button while submitting

    try {
      // Use the AuthContext login function
      const result = await login(formData.email, formData.password);
    
      if (result.success) {
        setIsValidated(true);
        clearForm();
        console.log("Login successful:", result.data.user);

        // Redirect to dashboard page
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <>
        <Head>
          <title>Feecon | Login</title>
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
                  <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Please sign in to your account to continue.
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
                      <label htmlFor="password">Password</label>
                    </div>
                    <div>
                      <input
                        type="password"
                        name="password"
                        required
                        autoComplete="current-password"
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
                        {isSubmitting ? "Signing In..." : "Login"}
                      </button>
                    </div>
                  </fieldset>
                  <div className="text-sm mt-4">
                    <div className="mb-2">
                      <Link
                        href={"/forgotPassword"}
                        className="underline text-primary hover:text-primary-dark"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div>
                      <span>
                        Don&apos;t have an account?{" "}
                        <Link
                          href={"/signup"}
                          className="underline text-primary hover:text-primary-dark"
                        >
                          Create one
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

export default Login;
