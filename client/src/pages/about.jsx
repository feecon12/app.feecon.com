import { AnimatedText } from "@/components/AnimatedText";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import { Layout } from "@/components/Layout";
import SkillAndCertifications from "@/components/SkillAndCertifications";
import Skills from "@/components/Skills";
import TransitionEffect from "@/components/TransitionEffect";
import axios from "axios";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/about`
        );
        if (response.data.data) {
          setAboutData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        // Continue with default content if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Feecon | About</title>
          <meta name="about page" content="This is about the developer." />
        </Head>
        <TransitionEffect />
        <main className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Feecon | About</title>
        <meta name="about page" content="This is about the developer." />
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
              <h2 className="mb-4 text-lg font-bold uppercase text-primary dark:text-light/75">
                Biography
              </h2>
              {aboutData?.biography ? (
                <p className="font-medium whitespace-pre-line">
                  {aboutData.biography}
                </p>
              ) : (
                <>
                  <p className="font-medium">
                    As a backend engineer with a passion for architecting robust
                    and scalable systems, I thrive on transforming complex
                    challenges into elegant, efficient solutions. My journey is
                    driven by a deep curiosity for how things work behind the
                    scenes and a continuous enthusiasm for modernizing legacy
                    infrastructures. I am particularly drawn to building the
                    foundational engines that power applications, ensuring they
                    are not only performant but also reliable and maintainable
                    for the long term.
                  </p>

                  <p className="my-4 font-medium">
                    My expertise is rooted in leading significant backend
                    transformations, most notably in re-architecting monolithic
                    applications into modular microservices. I find immense
                    satisfaction in designing systems that enhance performance,
                    from engineering high-concurrency APIs to building
                    intelligent data processing pipelines. The entire lifecycle,
                    from initial design and development to optimization and
                    mentoring, fuels my passion for creating technology that
                    delivers tangible impact and empowers teams to do their best
                    work.
                  </p>

                  <p className="font-medium">
                    I am consistently exploring the intersection of proven
                    engineering principles and emerging technologies, always
                    eager to tackle new problems that require thoughtful,
                    scalable architecture. I believe in building systems that
                    are not just functional but are also a delight for other
                    developers to work with. I am excited by the opportunity to
                    contribute to ambitious projects and collaborate with teams
                    that share a dedication to technical excellence and
                    innovation.
                  </p>
                </>
              )}
            </div>
            <div className="col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-8 dark:border-light dark:bg-dark xl:col-span-4 md:order-1 md:col-span-8">
              <div className="absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-2xl bg-dark" />
              {aboutData?.profileImage ? (
                <Image
                  src={aboutData.profileImage}
                  alt="Feecon"
                  className="w-full h-auto rounded-2xl"
                  width={500}
                  height={500}
                  priority
                />
              ) : (
                <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    No image
                  </span>
                </div>
              )}
            </div>

            <div className="col-span-2 flex flex-col items-end justify-between xl:col-span-8 xl:flex-row xl:items-center md:order-3">
              <div className="flex flex-col items-end justify-center xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  {aboutData?.clients ? (
                    aboutData.clients
                  ) : (
                    <>
                      <AnimatedNumbers value={30} />+
                    </>
                  )}
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  satisfied clients
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center  xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  {aboutData?.projectsCompleted ? (
                    aboutData.projectsCompleted
                  ) : (
                    <>
                      <AnimatedNumbers value={50} />+
                    </>
                  )}
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  projects completed
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center  xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  {aboutData?.yearsOfExperience ? (
                    aboutData.yearsOfExperience
                  ) : (
                    <>
                      <AnimatedNumbers value={5} />+
                    </>
                  )}
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  years of experiences
                </h2>
              </div>
            </div>
          </div>

          <Skills />
          <SkillAndCertifications />
          <Experience />
          <Education />
        </Layout>
      </main>
    </>
  );
};

export default about;
