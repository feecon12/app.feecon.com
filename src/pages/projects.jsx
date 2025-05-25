import React from "react";
import Head from "next/head";
import { Layout } from "@/components/Layout";
import { AnimatedText } from "@/components/AnimatedText";
import Link from "next/link";
import Image from "next/image";
import { GithubIcon } from "@/components/Icons";
import twitterBioGen from "../../public/images/projects/ai-powered-twitter-bio-generator.png";
import twitterBioGenInput from "../../public/images/projects/ai-powered-twitter-bio-generator-input.png";
import twitterBioGenOutput from "../../public/images/projects/ai-powered-twitter-bio-generator-output.png";
import pictoria from "../../public/images/projects/pictoria-ai.png";
import pictoria2 from "../../public/images/projects/pictoria-ai-2.png";
import image3 from "../../public/images/projects/folio-dark-bio.png";
import { motion } from "framer-motion";
import TransitionEffect from "@/components/TransitionEffect";

const FramerImage = motion(Image);

const FeaturedProject = ({ type, title, img, summary, link, github }) => {
  return (
    <article
      className="w-full flex items-center justify-between rounded-3xl border border-solid border-dark bg-light dark:bg-dark dark:border-light 
    shadow-2xl p-12
    lg:flex-col lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4
    "
    >
      <Link
        href={link}
        target="_blank"
        className="w-1/2 cursor-pointer overflow-hidden rounded-lg lg:w-full "
      >
        <FramerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      <div className="w-1/2 flex flex-col items-start justify-between pl-6 dark:text-light lg:w-full lg:pl-0 lg:pt-6">
        <span className="text-primary dark:text-primaryDark font-medium text-xl xs:text-base lg:text-lg md:text-base">
          {type}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2 "
        >
          <h2 className="mt-2 w-full text-left text-4xl font-bold dark:text-light sm:text-sm ">
            {title}
          </h2>
        </Link>
        <p className="my-2 font-medium text-dark dark:text-light sm:text-sm">
          {summary}
        </p>
        <div className="mt-2 flex items-center">
          <Link href={github} target="_blank" className="w-10 dark:text-light">
            <GithubIcon />
          </Link>
          <Link
            href={link}
            target="_blank"
            className="ml-4 rounded-lg bg-dark text-light p-2 px-6 text-lg font-semibold dark:bg-light dark:text-dark sm:px-4 sm:text-base"
          >
            Visit Project
          </Link>
        </div>
      </div>
    </article>
  );
};

const Project = ({ title, type, img, link, github }) => {
  return (
    <article className="w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light dark:bg-dark dark:border-light p-6 relative xs:p-5">
      <Link
        href={link}
        target="_blank"
        className="w-full cursor-pointer overflow-hidden rounded-lg lg:w-full "
      >
        <FramerImage
          src={img}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          priority
          sizes="(max-widthL768px) 100vw,
        (max-width:1200px) 60vw,
        50vw"
        />
      </Link>

      <div className="w-full flex flex-col items-start justify-between mt-4 dark:text-light">
        <span className="text-primary dark:text-primaryDark font-medium text-xl lg:text-lg md:text-base">
          {type}
        </span>
        <Link
          href={link}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left text-3xl font-bold dark:text-light lg:text-2xl">
            {title}
          </h2>
        </Link>
        <div className=" w-full mt-2 flex items-center justify-between">
          <Link
            href={link}
            target="_blank"
            className="text-lg font-semibold underline dark:text-light md:text-base"
          >
            Visit
          </Link>
          <Link href={github} target="_blank" className="w-8 md:w-6">
            <GithubIcon />{" "}
          </Link>
        </div>
      </div>
    </article>
  );
};
const projects = () => {
  return (
    <>
      <Head>
        <title>Feecon | Project Page </title>
        <meta name="description" contents="any description" />
      </Head>
      <TransitionEffect />

      <main className="w-full mb-16 flex flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText
            text="Imagination Surpasses Knowledge!"
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"
          />
          <div className="grid grid-cols-12 gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
            <div className="col-span-12">
              <FeaturedProject
                title={"AI Powered Twitter Bio Generator"}
                type="Featured project"
                summary="An AI-powered Twitter Bio Generator built using Llama 3 and Mixtral models from OpenAI.
It allows users to generate creative and catchy bios with customizable settings such as tone and creativity level. The application leverages advanced AI models to craft bios that reflect modern digital personalities, making it a fun and useful tool for social media enthusiasts."
                img={twitterBioGen}
                link="https://ai-powered-twitter-bio-generator-black.vercel.app/"
                github="https://github.com/feecon12/ai-powered-twitter-bio-generator"
              />
            </div>
            <div className="col-span-6  sm:col-span-12">
              <Project
                title={"Bio Generator - Custom User Inputs"}
                // type="Featured project"
                img={twitterBioGenInput}
                link="https://ai-powered-twitter-bio-generator-black.vercel.app/"
                github="https://github.com/feecon12/ai-powered-twitter-bio-generator"
              />
            </div>

            <div className="col-span-6  sm:col-span-12">
              <Project
                title={"Bio Generator - Outputs"}
                // type="Featured project"
                img={twitterBioGenOutput}
                link="https://ai-powered-twitter-bio-generator-black.vercel.app/"
                github="https://github.com/feecon12/ai-powered-twitter-bio-generator"
              />
            </div>

            <div className="col-span-12 sm:col-span-12">
              <FeaturedProject
                title={"Pictoria AI - AI Powered image generation app"}
                summary="A feature-rich Crypto Screener App using React, Tailwind CSS, Context API, React Router and Recharts. 
                It shows detail regarding almost all the cryptocurrency. You can easily convert the price in your 
                local currency."
                type="Featured project"
                img={pictoria}
                link="https://pictoria-ai-lovat.vercel.app/login"
                github="https://github.com/feecon12/pictoria-ai"
              />
            </div>
            <div className="col-span-6  sm:col-span-12">
              <Project
                title={"Pictoia AI - Generate Image"}
                type="Featured project"
                img={pictoria2}
                link="https://pictoria-ai-lovat.vercel.app/login"
                github="https://github.com/feecon12/pictoria-ai"
              />
            </div>

            <div className="col-span-6  sm:col-span-12">
              <Project
                title={"Pictoia AI - Generate Image"}
                type="Featured project"
                img={pictoria2}
                link="https://pictoria-ai-lovat.vercel.app/login"
                github="https://github.com/feecon12/pictoria-ai"
              />
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default projects;
