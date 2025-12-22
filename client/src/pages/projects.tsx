// @ts-nocheck
import { AnimatedText } from "@/components/AnimatedText";
import { GithubIcon } from "@/components/Icons";
import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect";
import { useDataContext } from "@/contexts/DataContext";
import urlConfig from "@/utils/urlConfig";
import axios from "axios";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const FramerImage = motion(Image);

interface FeaturedProjectProps {
  type: string;
  title: string;
  img?: string;
  summary: string;
  link: string;
  github?: string;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({
  type,
  title,
  img,
  summary,
  link,
  github,
}) => {
  return (
    <article
      className="w-full flex items-center justify-between rounded-3xl border border-solid border-dark bg-light dark:bg-dark dark:border-light 
    shadow-2xl p-12
    lg:flex-col lg:p-8 xs:rounded-2xl xs:rounded-br-3xl xs:p-4
    "
    >
      <Link
        href={link || "#"}
        target="_blank"
        className="w-1/2 cursor-pointer overflow-hidden rounded-lg lg:w-full "
      >
        <FramerImage
          src={img || "https://via.placeholder.com/800x600?text=Project+Image"}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          width={800}
          height={600}
          unoptimized
        />
      </Link>

      <div className="w-1/2 flex flex-col items-start justify-between pl-6 dark:text-light lg:w-full lg:pl-0 lg:pt-6">
        <span className="text-primary dark:text-primaryDark font-medium text-xl xs:text-base lg:text-lg md:text-base">
          {type}
        </span>
        <Link
          href={link || "#"}
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
          {github && github.trim() !== "" && (
            <Link
              href={github || "#"}
              target="_blank"
              className="w-10 dark:text-light"
            >
              <GithubIcon />
            </Link>
          )}
          <Link
            href={link || "#"}
            target="_blank"
            className={`${
              github && github.trim() !== "" ? "ml-4" : ""
            } rounded-lg bg-dark text-light p-2 px-6 text-lg font-semibold dark:bg-light dark:text-dark sm:px-4 sm:text-base`}
          >
            Visit Project
          </Link>
        </div>
      </div>
    </article>
  );
};

interface ProjectProps {
  title: string;
  type: string;
  img?: string;
  link: string;
  github?: string;
}

const Project: React.FC<ProjectProps> = ({
  title,
  type,
  img,
  link,
  github,
}) => {
  return (
    <article className="w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light dark:bg-dark dark:border-light p-6 relative xs:p-5">
      <Link
        href={link || "#"}
        target="_blank"
        className="w-full cursor-pointer overflow-hidden rounded-lg lg:w-full "
      >
        <FramerImage
          src={img || "https://via.placeholder.com/500x300?text=Project+Image"}
          alt={title}
          className="w-full h-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          width={500}
          height={300}
          unoptimized
        />
      </Link>

      <div className="w-full flex flex-col items-start justify-between mt-4 dark:text-light">
        <span className="text-primary dark:text-primaryDark font-medium text-xl lg:text-lg md:text-base">
          {type}
        </span>
        <Link
          href={link || "#"}
          target="_blank"
          className="hover:underline underline-offset-2"
        >
          <h2 className="my-2 w-full text-left text-3xl font-bold dark:text-light lg:text-2xl">
            {title}
          </h2>
        </Link>
        <div className=" w-full mt-2 flex items-center justify-between">
          <Link
            href={link || "#"}
            target="_blank"
            className="text-lg font-semibold underline dark:text-light md:text-base"
          >
            Visit
          </Link>
          {github && github.trim() !== "" && (
            <Link
              href={github || "#"}
              target="_blank"
              className="w-8 md:w-6 dark:text-light"
            >
              <GithubIcon />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
const Projects: React.FC = () => {
  const { projectsData, setProjectsData, projectsLoaded, setProjectsLoaded } =
    useDataContext();
  const [loading, setLoading] = useState<boolean>(!projectsLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectsLoaded) {
      const fetchProjects = async () => {
        try {
          const response = await axios.get(urlConfig.GET_PROJECTS);
          setProjectsData(response.data.data || []);
          setProjectsLoaded(true);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching projects:", err);
          setError("Failed to load projects");
          setProjectsLoaded(true);
          setLoading(false);
        }
      };

      fetchProjects();
    }
  }, [projectsLoaded]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Feecon | Projects</title>
          <meta name="description" content="Portfolio projects" />
        </Head>
        <TransitionEffect />
        <main className="w-full mb-16 flex flex-col items-center justify-center">
          <Layout className="pt-16">
            {/* Title skeleton */}
            <div className="w-full flex justify-center mb-16 sm:mb-8">
              <div className="h-16 w-[500px] bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-12 gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
              {/* Featured project skeleton */}
              <div className="col-span-12">
                <div className="w-full flex items-center justify-between rounded-3xl border border-solid border-dark dark:border-light bg-light dark:bg-dark shadow-2xl p-12 lg:flex-col lg:p-8">
                  <div className="w-1/2 lg:w-full h-80 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="w-1/2 lg:w-full pl-6 lg:pl-0 lg:pt-6">
                    <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                    <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Project cards skeleton */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-span-6 sm:col-span-12">
                  <div className="w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark dark:border-light bg-light dark:bg-dark p-6">
                    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
                    <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Layout>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Feecon | Projects</title>
        <meta name="description" content="Portfolio projects" />
      </Head>
      <TransitionEffect />

      <main className="w-full mb-16 flex flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText
            text="Imagination Surpasses Knowledge!"
            className="mb-16 lg:!text-7xl sm:mb-8 sm:!text-6xl xs:!text-4xl"
          />

          {error ? (
            <div className="text-center text-red-500 dark:text-red-400">
              <p>{error}</p>
            </div>
          ) : projectsData.length === 0 ? (
            <div className="text-center text-dark dark:text-light">
              <p className="text-xl">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
              {projectsData.map((project, index) => {
                // Alternate between featured (full width) and regular projects
                const isFeatured = index % 3 === 0;

                if (isFeatured) {
                  return (
                    <div key={project._id} className="col-span-12">
                      <FeaturedProject
                        title={project.title}
                        type="Featured Project"
                        summary={project.description}
                        img={project.image}
                        link={project.liveLink}
                        github={project.githubLink}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={project._id}
                      className="col-span-6 sm:col-span-12"
                    >
                      <Project
                        title={project.title}
                        type="Project"
                        img={project.image}
                        link={project.liveLink}
                        github={project.githubLink}
                      />
                    </div>
                  );
                }
              })}
            </div>
          )}
        </Layout>
      </main>
    </>
  );
};

export default Projects;
