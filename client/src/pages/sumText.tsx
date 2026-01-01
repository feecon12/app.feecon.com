// @ts-nocheck
import { AnimatedText } from "@/components/AnimatedText";
import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect";
import URL from "@/utils/urlConfig";
import axios from "axios";
import Head from "next/head";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface BioFormData {
  prompt: string;
  temperature: string;
  tone: string;
  maxTokens: string;
  model: string;
}

const BioGenerator: React.FC = () => {
  const [formData, setFormData] = useState<BioFormData>({
    prompt: "",
    temperature: "0.7",
    tone: "",
    maxTokens: "160",
    model: "llama3-8b-8192",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedBio, setGeneratedBio] = useState<string>("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Trigger validation on each input change
    // validateForm({ ...formData, [name]: value });
  }

  //Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const reqData = {
        ...formData,
        temperature: parseFloat(formData.temperature) || 0.7,
        maxTokens: parseInt(formData.maxTokens) || 150,
      };

      const response = await axios.post(URL.GENERATE_AI_TEXT, reqData, {
        withCredentials: false,
      });

      if (response.status === 201) {
        console.log("response:", response);
        setGeneratedBio(response.data.data.response);
        toast.success("Text generated successfully");
      }
    } catch (error) {
      console.error(
        "Error in generating text:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to generate bio. Please try again."
      );
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBio);
    toast.success("Text copied to clipboard!");
  };

  return (
      <>
        <Head>
          <title>Feecon | Generator AI </title>
          <meta
            name="Text Generator AI page"
            contents="This is Generator AI app whih can generate all kind of text outputs based on a single prompt."
          />
        </Head>
        <TransitionEffect />
        <main>
          <Layout className="pt-0 md:pt-16 sm:pt-8">
            <div className="col-span-full w-full flex flex-col items-center justify-center space-y-4 mb-4 text-center">
              <AnimatedText
                text="CRAFT THE PERFECT SUMMARY IN SECONDS!"
                className="font-extrabold text-5xl text-center w-full lg:w-[90%] uppercase"
              />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Just answer a few questions, and we&apos;ll generate an summary
                for you.
              </p>
            </div>

            <div className="relative flex flex-col items-start gap-8">
              {/* input form div */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 grid w-full items-start gap-6"
              >
                <fieldset className="bg-gray-50 dark:bg-gray-800  border-gray-200 dark:border-gray-700 grid gap-6 rounded-[8px] border p-4 bg-background/10 backdrop-blur-sm">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <div className="grid gap-3">
                    <label
                      htmlFor="prompt"
                      className="block text-sm font-medium"
                    >
                      What would you like to generate today?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      type="text"
                      name="prompt"
                      placeholder="E.g., Software Engineer passionate about React"
                      value={formData.prompt}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                    />
                  </div>

                  <div className="grid gap-3">
                    <label htmlFor="tone" className="block text-sm font-medium">
                      Preferred Tone <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                    >
                      <option value="">Select a tone</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="humorous">Humorous</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <div className="space-y-2">
                      <label
                        htmlFor="model"
                        className="block text-sm font-medium"
                      >
                        AI Model
                      </label>
                      <select
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                      >
                        <option value="llama3-8b-8192">Llama3-8b-8192</option>
                        <option value="llama3-70b-8192">Llama3-70b-8192</option>
                        <option value="llama-3.3-70b-versatile">
                          llama-3.3-70b-versatile
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="temperature"
                        className="block text-sm font-medium"
                      >
                        Creativity (0.1-1.0)
                      </label>
                      <input
                        type="range"
                        name="temperature"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={formData.temperature || 0.7}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <label
                      htmlFor="maxTokens"
                      className="block text-sm font-medium"
                    >
                      Maximum Length (50-280 characters)
                    </label>
                    <input
                      type="number"
                      name="maxTokens"
                      value={formData.maxTokens || 160}
                      onChange={handleChange}
                      min="50"
                      max="280"
                      className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800"
                    />
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-light py-3 px-6 rounded-lg text-lg font-semibold hover:bg-primary/80 transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        "Generate"
                      )}
                    </button>
                  </div>
                </fieldset>
              </form>

              {/* Output Section */}
              <div className="relative w-full flex min-h-[50vh] mt-2 flex-col rounded-xl bg-muted/50 backdrop-blur-sm overflow-hidden border border-primary/5">
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[50vh]">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                          Thanks for holding up...
                        </p>
                      </div>
                    </div>
                  ) : generatedBio ? (
                    <div className="space-y-4">
                      <div
                        className="w-full text-base border border-primary/20 rounded-md p-4 relative bg-background"
                        dangerouslySetInnerHTML={{
                          __html: generatedBio.replace(/\n/g, "<br/>"),
                        }}
                      />
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500">
                          Character count: {generatedBio.length}/280
                        </p>
                        <button
                          onClick={copyToClipboard}
                          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-1 px-3 rounded text-sm flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        Your generated bio will appear here. Fill out the form
                        and click &quot;Generate&quot; to get started.
                      </p>
                    </div>
                  )}
                </div>

                {generatedBio && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Not quite right?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Try adjusting your prompt to be more specific, or change
                      the tone and creativity settings.
                    </p>
                    <button
                      onClick={() => setGeneratedBio("")}
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      Clear and try again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Layout>
        </main>
      </>
  );
};

export default BioGenerator;
