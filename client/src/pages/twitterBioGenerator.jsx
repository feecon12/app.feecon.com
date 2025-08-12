import ProtectedRoute from "@/components/ProtectedRoute";
import TransitionEffect from "@/components/TransitionEffect";
import Head from "next/head";
import React from "react";

const TwitterBioGenerator = () => {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="w-full h-screen overflow-hidden">
        <TransitionEffect />
        <Head>
          <title>Twitter Bio Generator</title>
          <meta
            name="description"
            content="Generate creative Twitter bios using AI"
          />
        </Head>
        <iframe
          src="https://ai-powered-twitter-bio-generator-black.vercel.app/"
          className="w-full h-full border-none"
          title="Twitter Bio Generator"
          allow="clipboard-write; camera; microphone; fullscreen"
        />
      </div>
    </ProtectedRoute>
  );
};

export default TwitterBioGenerator;
