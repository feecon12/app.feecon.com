import ProtectedRoute from "@/components/ProtectedRoute";
import TransitionEffect from "@/components/TransitionEffect";
import Head from "next/head";
import React from "react";

const FotofunicAI: React.FC = () => {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="w-full h-screen flex flex-col">
        <TransitionEffect />
        <Head>
          <title>Fotofunic AI</title>
        </Head>
        <iframe
          src="https://fotofunic.vercel.app/image-generation"
          className="w-full flex-1 border-none"
          title="Fotofunic AI"
          allow="camera; microphone; fullscreen"
        />
      </div>
    </ProtectedRoute>
  );
};

export default FotofunicAI;
