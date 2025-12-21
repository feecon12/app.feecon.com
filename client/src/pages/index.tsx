import { AnimatedText } from "@/components/AnimatedText";
import HireMe from "@/components/HireMe";
import { LinkArrow } from "@/components/Icons";
import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect";
import { HomeContent } from "@/types";
import axios from "axios";
import { Inter } from "next/font/google";
import Head from "next/head";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import profilepic from "../../public/images/profile/dev1.png";
import lightBulb from "../../public/images/svgs/bulb.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async (): Promise<void> => {
    try {
      const response = await axios.get<{ data: HomeContent }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/home`
      );
      if (response.data.data) {
        setHomeContent(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching home content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fallback content
  const heroText =
    homeContent?.heroText ||
    "Bringing Dreams to Life: Where Vision Meets Code and Design";
  const bioParagraph =
    homeContent?.bioParagraph ||
    "As a seasoned software engineer with 5+ years of expertise, I specialize in crafting robust web solutions across healthcare and insurance sectors. From conceptualization to production deployment, I've architected scalable applications that drive business success. My passion lies in building intuitive, high-performance software that seamlessly bridges user needs with cutting-edge technology. I thrive on tackling complex challenges and continuously expanding my technical horizons to deliver exceptional digital experiences.";
  const profileImage: string | StaticImageData =
    homeContent?.profileImage || profilepic;
  const resumeLink = homeContent?.resumeLink || "/Feecon_resume_fullstack.pdf";

  return (
    <>
      <Head>
        <title>FEECON | Portfolio</title>
        <meta
          name="description"
          content="Professional portfolio showcasing projects and expertise"
        />
      </Head>
      <TransitionEffect />
      <main className="flex items-center text-dark w-full min-h-screen dark:text-light ">
        <Layout className="pt-0 md:pt-16 sm:pt-8">
          <div className="flex items-center justify-between w-full lg:flex-col">
            <div className="w-1/2 md:w-full">
              <Image
                src={profileImage}
                alt="FME"
                className="w-full h-auto lg:hidden md:inline-block md:w-full"
                priority
                width={500}
                height={500}
                unoptimized
                sizes="(max-widthL768px) 100vw,
                (max-width:1200px) 60vw,
                50vw"
              />
            </div>
            <div className="w-1/2 flex flex-col items-center self-center lg:w-full lg:text-center">
              <AnimatedText
                text={heroText}
                className="!text-6xl !text-left xl:!text-5xl lg:!text-center  lg:!text-6xl md:!text-6xl sm:!text-3xl"
              />
              <p className="my-4 text-base font-medium md:text-sm sm:text-xs">
                {bioParagraph}
              </p>
              <div className="flex items-center self-start mt-2 lg:self-center">
                <Link
                  href={resumeLink}
                  target={"_blank"}
                  className="flex items-center bg-dark text-light p-2 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid hover:border-dark dark:bg-light dark:text-dark hover:dark:bg-dark hover:dark:text-light hover:dark:border-light md:p-2 md:px-4 md:text-base "
                  download={true}
                >
                  Resume <LinkArrow className={"w-5 ml-1"} />
                </Link>

                <Link
                  href="contactus"
                  className="ml-4 text-lg font-medium  capitalize text-dark underline dark:text-light md:text-base"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
          <HireMe />
          <div className="absolute right-8 bottom-0 inline-block w-24">
            <Image
              src={lightBulb}
              alt="Feecon"
              className="w-full h-auto md:hidden"
            />
          </div>
        </Layout>
      </main>
    </>
  );
}
