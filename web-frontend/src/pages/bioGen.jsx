import { AnimatedText } from "@/components/AnimatedText";
import { Layout } from "@/components/Layout";
import URL from "@/utils/urlConfig";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";

const BioGenerator = () => {
  const [formData, setFormData] = useState({
    prompt: "",
    temperature: "",
    tone: "",
    maxTokens: "",
    model: "",
  });

  // const [isValidated, setIsValidated] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Trigger validation on each input change
    // validateForm({ ...formData, [name]: value });
  }

  //Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reqData = {
        ...formData,
        temperature: parseFloat(formData.temperature) || 0.7,
        maxTokens: parseInt(formData.maxTokens) || 150,
      };
      // console.log("request data is", reqData);

      const response = await axios.post(URL.GENERATE_AI_TEXT, reqData);

      if (response.status === 201) {
        console.log("response:", response);
      }
    } catch (error) {
      "Error sending message:",
        console.error(error.response?.data || error.message);
    } finally {
      // setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <>
      <Head>
        <title>Feecon | Bio Generator AI </title>
        <meta
          name="Bio Generator AI page"
          contents="This is Bio Generator AI app."
        />
      </Head>
      <main className="w-full flex flex-col items-center justify-center dark:text-light">
        <Layout className="pt-0 md:pt-16 sm:pt-8">
          <div className="col-span-full w-full flex flex-col items-center justify-center space-y-4 mb-4 text-center">
            <AnimatedText
              text="CRAFT THE PERFECT TWITTER BIO IN SECONDS!"
              className="!text-6xl xl:!text-5xl lg:!text-center lg:!text-6xl md:!text-6xl sm:!text-3xl"
            />
            <p className="text-lg text-amber-700">
              Just answer a few questions, and we&apos;ll generate a Twitter bio
              for you.
            </p>
          </div>
          <div className="flex items-center justify-between w-full lg:flex-col">
            <div className="w-1/2 md:w-full md:hidden">
              {/* <Image
              src={fillForm}
              alt="FME"
              className="w-full h-auto lg:hidden md:inline-block md:w-full"
              priority
              sizes="(max-widthL768px) 100vw,
                         (max-width:1200px) 60vw,50vw"
            /> */}
            </div>

            <div className="w-1/2 flex flex-col px-10 py-5 self-center lg:w-full lg:text-center sm:px-0">
              {/* <h1 className="text-7xl font-bold">Contact me</h1> */}
              <form onSubmit={handleSubmit}>
                <fieldset className="capitalize">
                  <label htmlFor="prompt">promt</label>
                  <div>
                    <input
                      type="text"
                      name="prompt"
                      value={formData.prompt}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="temperature">temperature</label>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="tone">tone</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxTokens">max token</label>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="maxTokens"
                      value={formData.maxTokens}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded-lg focus:outline-none"
                      min="1"
                      max="4000"
                      step="1"
                    />
                  </div>
                  <div>
                    <label htmlFor="model">model</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      // disabled={!isValidated || isSubmitting}
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

export default BioGenerator;
