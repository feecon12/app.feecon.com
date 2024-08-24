import React, { useRef, useEffect } from "react";
import Head from "next/head";
import { AnimatedText } from "@/components/AnimatedText";
import { Layout } from "@/components/Layout";
import ProfilePic from "../../public/images/profile/mypic.jpg";
import Image from "next/image";
import { useMotionValue, useInView, useSpring } from "framer-motion";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import TransitionEffect from "@/components/TransitionEffect";

const AnimatedNumbers = ({ value }) => {
  const ref = useRef(null);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0);
      }
    });
  }, [springValue, value]);

  return <span ref={ref}> </span>;
};

const about = () => {
  return (
    <>
      <Head>
        <title>Feecon | About Page </title>
        <meta name="description" contents="any description" />
      </Head>
      <TransitionEffect />
      <main className="flex w-full flex-col items-center justify-center dark:text-light">
        <Layout className="pt-16 ">
          <AnimatedText
            text="Passion Empowers Purpose!"
            className="mb-16 lg:!text-7xl sm:!text-6xl xs:!text-4xl sm:mb-8"
          />

          <div className="grid w-full grid-cols-8 gap-16 pt-16 sm:gap-8">
            <div className="col-span-3 flex flex-col items-start justify-start xl:col-span-4 md:order-2 md:col-span-8">
              <h2 className="mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75">
                Me
              </h2>
              <p className="font-medium">
                With over 2 years of QA experience, I excel in developing
                efficient test strategies that reduce testing efforts by 40%. In
                my previous role, I logged 1,000+ critical defects in
                Salesforce, ensuring product smoothness across SDLC stages.
                I&apos;m passionate about transitioning to React development,
                having acquired skills in web development, JavaScript, and cloud
                tech (AWS, Azure).
              </p>

              <p className="my-4 font-medium">
                My ability to improve product efficiency through defect
                debugging and my agile mindset are assets. I&apos;m dedicated to
                creating user-centric web applications, blending my QA expertise
                with React development to deliver innovation and quality. As an
                aspiring React developer, I&apos;m committed to continuous
                learning and growth, with a goal of applying my quality-driven
                mindset to create cutting-edge, interactive web solutions that
                enhance user experiences.
              </p>
            </div>
            <div className="col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-8 dark:border-light dark:bg-dark xl:col-span-4 md:order-1 md:col-span-8">
              <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-2xl bg-dark" />
              <Image
                src={ProfilePic}
                alt="Feecon"
                className="w-full h-auto rounded-2xl"
                priority
                sizes="(max-widthL768px) 100vw,
                            (max-width:1200px) 60vw,
                            33vw"
              />
            </div>

            <div className="col-span-2 flex flex-col items-end justify-between xl:col-span-8 xl:flex-row xl:items-center md:order-3">
              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  <AnimatedNumbers value={4} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  satisfied clients
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center  xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  <AnimatedNumbers value={10} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  projects completed
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center  xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  <AnimatedNumbers value={2} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  years of experiences
                </h2>
              </div>
            </div>
          </div>

          <Skills />
          <Experience />
          <Education />
        </Layout>
      </main>
    </>
  );
};

export default about;
