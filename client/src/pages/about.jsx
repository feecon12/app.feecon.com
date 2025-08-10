import { AnimatedText } from "@/components/AnimatedText";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import { Layout } from "@/components/Layout";
import SkillAndCertifications from "@/components/SkillAndCertifications";
import Skills from "@/components/Skills";
import TransitionEffect from "@/components/TransitionEffect";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ProfilePic from "../../public/images/profile/dev-pic.png";

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
        <title>Feecon | About</title>
        <meta name="about page" contents="This is about the developer." />
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
              <p className="font-medium">
                As a seasoned software engineer with extensive experience across
                multiple technology stacks, I specialize in crafting robust,
                scalable solutions that drive business success through
                continuous innovation and technical excellence. My expertise
                encompasses the complete development lifecycle, from data
                extraction and processing using advanced web scraping techniques
                and Regular Expressions, to building sophisticated applications
                with modern JavaScript frameworks that consistently deliver
                transformative results.
              </p>

              <p className="my-4 font-medium">
                I architect dynamic user interfaces leveraging React.js, backed
                by my Meta certification from Coursera as a professional React
                Developer. My full-stack capabilities extend to designing and
                implementing scalable server-side architectures using Express.js
                and Node.js, ensuring optimal performance and maintainability
                across enterprise-level applications. I thrive on solving
                complex challenges by combining deep technical knowledge with
                strategic thinking to anticipate future business needs.
              </p>

              <p className="font-medium">
                My cloud expertise is validated through industry-recognized
                certifications including AWS Solutions Architect Associate and
                Azure Data Engineering. These credentials demonstrate my
                proficiency in designing cloud-native solutions that leverage
                the full potential of modern cloud platforms to deliver
                exceptional scalability and reliability. My passion for emerging
                technologies and proven track record of successful project
                delivery make me an ideal partner for organizations seeking
                digital transformation solutions.
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
                  <AnimatedNumbers value={10} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  satisfied clients
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center  xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  <AnimatedNumbers value={30} />+
                </span>
                <h2 className="text-xl font-medium capitalize text-dark/75 dark:text-light/75 xl:text-center md:text-lg xs:text-base">
                  projects completed
                </h2>
              </div>

              <div className="flex flex-col items-end justify-center  xl:items-center">
                <span className="inline-block text-7xl font-bold md:text-6xl sm:text-5xl xs:text-4xl ">
                  <AnimatedNumbers value={4} />+
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
