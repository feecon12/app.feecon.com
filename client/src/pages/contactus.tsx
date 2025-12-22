// @ts-nocheck
import { Layout } from "@/components/Layout";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import fillForm from "../../public/images/svgs/message.svg";
import TransitionEffect from "../components/TransitionEffect";
import URL from "../utils/urlConfig";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      name: "",
      email: "",
      message: "",
    });
    setIsValidated(false); // Reset validation
  }

  function validateForm(data: ContactFormData) {
    const isFormValid = data.name && data.email && data.message;
    setIsValidated(isFormValid); // Button will be enabled if fields are filled
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidated) return; // Prevent submission if form is not valid

    setIsSubmitting(true); // Disable button while submitting

    //toast loading
    const toastId = toast.loading("Sending your message...");

    try {
      // Make sure your API URL is correctly formatted (e.g., with a trailing slash)
      const response = await axios.post(URL.SEND_MESSAGE, formData);

      if (response.status === 201) {
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
        console.log("Message sent successfully:");
      }
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );

      // Error toast
      toast.update(toastId, {
        render: "Error while sending message. Please try again later.",
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
      <Head>
        <title>Feecon | Contact</title>
        <meta name="Contact page" contents="This is BContact Us page." />
      </Head>
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
