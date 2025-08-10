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
        "Architected and deployed automated web scraping solutions using JavaScript to streamline healthcare credentialing data extraction and processing workflows.",
    },
    {
      bullet:
        "Leveraged advanced CSS selectors and DOM manipulation techniques to build dynamic, event-driven JavaScript applications with enhanced user interaction capabilities.",
    },
    {
      bullet:
        "Engineered high-performance data transformation pipelines using Ruby and Regular Expressions, achieving 30% improvement in processing efficiency and system throughput.",
    },
    {
      bullet:
        "Conducted comprehensive code reviews and quality assurance processes, resulting in 90% improvement in deliverable quality and reduced production defects.",
    },
    {
      bullet:
        "Collaborated cross-functionally with stakeholders through Azure DevOps boards, implementing agile methodologies to ensure timely project delivery and stakeholder alignment.",
    },
  ];
  const pwcWork = [
    {
      bullet:
        "Spearheaded end-to-end development of a comprehensive caregiver platform utilizing Node.js, Express.js, and React.js, delivering scalable healthcare solutions.",
    },
    {
      bullet:
        "Designed and implemented robust RESTful API architectures with Express Framework, achieving 20% reduction in third-party integration time through optimized service connectivity.",
    },
    {
      bullet:
        "Orchestrated comprehensive API testing strategies using Postman, significantly accelerating development velocity while maintaining high software quality standards.",
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
            position={"Associate Software Engineer"}
            company={"Verisys"}
            companyLink={"www.verisys.com"}
            time={"Feb 2024 - present"}
            address={"Hyderabad, Telangana"}
            work={verisysWork}
          />
          <DetailCard
            position={"Associate"}
            company={"PwC"}
            companyLink={"www.pwc.com"}
            time={"Apr 2021 - Oct 2023"}
            address={"Bangalore, Karnataka"}
            work={pwcWork}
          />
        </ul>
      </div>
    </div>
  );
};

export default Experience;
