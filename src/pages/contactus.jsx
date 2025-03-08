import { useState } from "react";
import fillForm from "../../public/images/profile/herocontactpage.png";
import TransitionEffect from "../components/TransitionEffect";
import { Layout } from "@/components/Layout";
import axios from "axios";
import { toast } from "react-hot-toast";
// import URL from "../urlConfig";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
      name: "",
      email: "",
      message: "",
    });
    setIsValidated(false); // Reset validation
  }

  function validateForm(data) {
    const isFormValid = data.name && data.email && data.message;
    setIsValidated(isFormValid); // Button will be enabled if fields are filled
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidated) return; // Prevent submission if form is not valid

    setIsSubmitting(true); // Disable button

    // Show loading toast before axios request
    const toastId = toast.loading("Sending message...");

    try {
      // Make sure your API URL is correctly formatted (e.g., with a trailing slash)
      const response = await axios.post('/api/contact', formData);

      if (response.status === 201) {
        setIsValidated(true); // Set the state to true
        clearForm(); // Clear form after successful submission

        // Success toast
        toast.success("Message delivered!", { id: toastId, duration: 3000 });
      }
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );

      // Error toast
      toast.error("Error while sending message. Please try again later.", {
        id: toastId,
        duration: 3000,
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
              <img src={fillForm} alt="fill contact form" width={600} />
            </div>

            <div className="w-1/2 flex flex-col px-10 py-5 self-center lg:w-full lg:text-center sm:px-0">
              <h1 className="text-7xl font-bold">Contact me</h1>
              <form onSubmit={handleSubmit}>
                <fieldset className="capitalize">
                  <div>
                    <label htmlFor="name">Name</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
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
                      value={formData.email}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="message">Message</label>
                  </div>
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={7}
                      cols={30}
                      className="border px-2 py-1 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={!isValidated || isSubmitting}
                      className="bg-primary text-light mt-2 py-2 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-primary border-2 border-solid hover:border-primary"
                    >
                      Send message
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

export default Contact;

