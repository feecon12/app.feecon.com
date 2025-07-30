import { Layout } from "@/components/Layout";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import fillForm from "../../public/images/profile/herocontactpage.png";
import TransitionEffect from "../components/TransitionEffect";
import URL from "../utils/urlConfig";

const Login = () => {
  const router = useRouter();
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

    //toast loading
    const toastId = toast.loading("Authenticating...");

    try {
      // Make sure your API URL is correctly formatted (e.g., with a trailing slash)
      const response = await axios.post(URL.LOGIN, formData);

      if (response.status === 200) {
        // Success toast
        toast.update(toastId, {
          render: response.data.message,
          type: "success",
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
        }); // Show success message
        // alert("Message sent successfully! I will get back to you as soon as possible. Thank you for reaching out!");
        setIsValidated(true); // Set the state to true
        clearForm(); // Clear form after successful submission
        console.log("Login successfully:");
        router.push("/");
      }
    } catch (error) {
      console.error("Error login", error.response?.data || error.message);

      // Error toast
      toast.update(toastId, {
        render: "Error while login. Please try again later.",
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
              {/* <h1 className="text-7xl font-bold">Login</h1> */}
              <form onSubmit={handleSubmit}>
                <fieldset className="capitalize">
                  <div>
                    <label htmlFor="email">Email</label>
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
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
                      autoComplete="true"
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
                      Login
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Login;
