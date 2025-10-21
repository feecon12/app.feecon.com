import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import LiIcon from "./LiIcon";

const DetailCard = ({
  position,
  company,
  companyLink,
  time,
  address,
  work,
}) => {
  return (
    <div className="my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between md:w-[80%]">
      <LiIcon />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3 className="capitalize font-bold text-2xl sm:text-xl cs:text-lg">
          {position}
          &nbsp;
          <a
            href={companyLink}
            target="_blank"
            className="text-primary capitalize dark:text-primaryDark "
          >
            @{company}
          </a>
        </h3>

        <span className="capitalize font-medium text-dark/75 dark:text-light/75 xs:text-sm">
          {time} | {address}
        </span>

        <div className="font-medium w-full md:text-sm px-3">
          {work.map((item, index) => (
            <li className="mt-2 list-disc" key={index}>
              {item.bullet}
            </li>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Experience = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const verisysWork = [
    {
      bullet:
        "Led the modernization of a legacy web crawler by architecting and building a scalable microservices system.",
    },
    {
      bullet:
        "Engineered high-performance APIs and background services, significantly improving system speed and responsiveness.",
    },
    {
      bullet:
        "Improved operational efficiency and reduced infrastructure costs by optimizing server capacity and resource management.",
    },
    {
      bullet:
        "Enhanced data reliability and success rates by implementing advanced crawling strategies and robust data pipelines.",
    },
    {
      bullet:
        "Established a future-proof, maintainable architecture by cleanly separating API, worker, and storage concerns.",
    },
  ];
  const capGWork = [
    {
      bullet:
        "Developed foundational skills in full-stack development by building dynamic and interactive web components.",
    },
    {
      bullet:
        "Collaborated with senior developers on project work, gaining hands-on experience with professional development workflows.",
    },
  ];
  const pwcWork = [
    {
      bullet:
        "Spearheaded the full-stack development of an internal platform, leading to a marked increase in user adoption.",
    },
    {
      bullet:
        "Designed and scaled backend systems to support a large user base and integrated real-time communication features.",
    },
    {
      bullet:
        "Mentored junior engineers and established team standards to elevate code quality and consistency.",
    },
    {
      bullet:
        "Enhanced team agility and project predictability through active participation in Agile process refinement.",
    },
  ];

  return (
    <div className="my-32">
      <h2 className="font-bold text-8xl mb-32 w-full text-center md:text-6xl xs:text-4xl md:mb-16">
        Experience
      </h2>

      <div ref={ref} className="w-[75%] mx-auto relative lg:w-[90%] md:w-full">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light 
                    md:w-[2px] md:left-[30px] xs:left-[20px]
                    "
        />

        <ul className="w-full flex flex-col items-start justify-between ml-4 xs:ml-2">
          <DetailCard
            position={"Product"}
            company={"Verisys"}
            companyLink={"www.verisys.com"}
            time={"Feb 2024 - present"}
            address={"Hyderabad, Telangana"}
            work={verisysWork}
          />
          <DetailCard
            position={"Software Developer Engineer"}
            company={"PwC"}
            companyLink={"www.pwc.com"}
            time={"Apr 2021 - Jan 2024"}
            address={"Bangalore, Karnataka"}
            work={pwcWork}
          />
          <DetailCard
            position={"Software Intern"}
            company={"Capgemini"}
            companyLink={"www.capgemini.com"}
            time={"Jul 2020 - Oct 2020"}
            address={"Remote"}
            work={capGWork}
          />
        </ul>
      </div>
    </div>
  );
};

export default Experience;
