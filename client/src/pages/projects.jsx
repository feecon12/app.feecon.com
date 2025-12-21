import { AnimatedText } from "@/components/AnimatedText";
import { GithubIcon } from "@/components/Icons";
import { Layout } from "@/components/Layout";
import TransitionEffect from "@/components/TransitionEffect";
import axios from "axios";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
          {github && github.trim() !== "" && (
            <Link
              href={github}
              target="_blank"
              className="w-10 dark:text-light"
            >
              <GithubIcon />
            </Link>
          )}
          <Link
            href={link}
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

const Project = ({ title, type, img, link, github }) => {
  return (
    <article className="w-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light dark:bg-dark dark:border-light p-6 relative xs:p-5">
      <Link
        href={link}
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
          {github && github.trim() !== "" && (
            <Link
              href={github}
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
const projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/projects`
        );
        setProjects(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Feecon | Projects</title>
          <meta name="description" content="Portfolio projects" />
        </Head>
        <TransitionEffect />
        <main className="w-full mb-16 flex flex-col items-center justify-center min-h-screen">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
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
          ) : projects.length === 0 ? (
            <div className="text-center text-dark dark:text-light">
              <p className="text-xl">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-24 gap-y-32 xl:gap-x-16 lg:gap-x-8 md:gap-y-24 sm:gap-x-0">
              {projects.map((project, index) => {
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
                        link={project.projectUrl}
                        github={project.githubUrl}
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
                        link={project.projectUrl}
                        github={project.githubUrl}
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

export default projects;
