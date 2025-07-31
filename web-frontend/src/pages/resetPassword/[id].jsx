import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect.js";
import URL from "@/utils/urlConfig";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import fillForm from "../../../public/images/profile/herocontactpage.png";

const ResetPassword = () => {
  const router = useRouter();
  const { id: userId } = router.query;

  const [formData, setFormData] = useState({
    otp: "",
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
      otp: "",
      password: "",
    });
    setIsValidated(false); // Reset validation
  }

  function validateForm(data) {
    const isFormValid = data.otp && data.password;
    setIsValidated(isFormValid); // Button will be enabled if fields are filled
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidated) return; // Prevent submission if form is not valid

    // Check if userId is available
    if (!userId) {
      toast.error("User is not available.");
      return;
    }

    setIsSubmitting(true); // Disable button while submitting

    //toast loading
    const toastId = toast.loading("Resetting password...");

    try {
      console.log("Resetting password for userId:", userId);

      const response = await axios.patch(
        `${URL.RESET_PASSWORD}/${userId}`,
        formData
      );

      console.log(response);

      if (response.status === 200) {
        // Success toast
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
        });
        setIsValidated(true);
        clearForm();
        console.log("Password reset successful:");
        router.push("/login");
      }
    } catch (error) {
      console.error(error.message);

      // Error toast
      toast.update(toastId, {
        render: error.response?.data?.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
        closeOnClick: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TransitionEffect />
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
                <h1 className="text-4xl font-bold mb-2">Reset Password?</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter the 6-digit otp that sent to your email address and
                  enter the new password.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <fieldset className="capitalize">
                  <div>
                    <label htmlFor="otp">6-Digit OTP</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="otp"
                      required
                      maxLength="6"
                      pattern="[0-9]{6}"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
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
        </Layout>
      </main>
    </>
  );
};

export default ResetPassword;
