// @ts-nocheck
import { Skill as SkillType } from "@/types";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SkillProps {
  name: string;
  x: string;
  y: string;
}

const Skill: React.FC<SkillProps> = ({ name, x, y }) => {
  return (
    <motion.div
      className="flex items-center justify-center rounded-full font-semibold bg-dark text-light py-3 px-6 shadow-dark absolute dark:bg-light dark:text-dark 
        lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3 xs:bg-transparent xs:dark:bg-transparent xs:text-dark xs:dark:text-light xs:text-bold
        
        "
      whileHover={{ scale: 1.05 }}
      initial={{ x: 0, y: 0 }}
      whileInView={{ x: x, y: y, transition: { duration: 1.5 } }}
      viewport={{ once: true }}
    >
      {name}
    </motion.div>
  );
};

interface DefaultSkill {
  name: string;
  x: string;
  y: string;
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<(SkillType | DefaultSkill)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async (): Promise<void> => {
    try {
      const response = await axios.get<{ data: SkillType[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/skills`
      );
      if (response.data.data && response.data.data.length > 0) {
        setSkills(response.data.data);
      } else {
        // Fallback to default skills
        setSkills([
          { name: "Postgresql", x: "-25vw", y: "2vw" },
          { name: "S3", x: "-5vw", y: "-10vw" },
          { name: "JavaScript", x: "20vw", y: "6vw" },
          { name: "React.JS", x: "0vw", y: "12vw" },
          { name: "Express.Js", x: "-20vw", y: "-15vw" },
          { name: "Docker", x: "15vw", y: "-12vw" },
          { name: "System Design", x: "0vw", y: "-20vw" },
          { name: "Azure", x: "-25vw", y: "18vw" },
          { name: "Redis", x: "18vw", y: "18vw" },
          { name: "MongoDB", x: "32vw", y: "-5vw" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      // Fallback to default skills
      setSkills([
        { name: "Postgresql", x: "-25vw", y: "2vw" },
        { name: "S3", x: "-5vw", y: "-10vw" },
        { name: "JavaScript", x: "20vw", y: "6vw" },
        { name: "React.JS", x: "0vw", y: "12vw" },
        { name: "Express.Js", x: "-20vw", y: "-15vw" },
        { name: "Docker", x: "15vw", y: "-12vw" },
        { name: "System Design", x: "0vw", y: "-20vw" },
        { name: "Azure", x: "-25vw", y: "18vw" },
        { name: "Redis", x: "18vw", y: "18vw" },
        { name: "MongoDB", x: "32vw", y: "-5vw" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="font-bold text-8xl mt-64 w-full text-center md:text-6xl md:mt-32">
        Skills
      </h2>
      <div
        className="w-full h-screen relative flex items-center justify-center rounded-full bg-circularLight dark:bg-circularDark
            lg:h-[80vh] sm:h-[60vh] xs:h-[50vh]
            lg:bg-circularLightLg lg:dark:bg-circularDarkLg
            mb:bg-circularLightMb mb:dark:bg-circularDarkMb
            sm:bg-circularLightSm sm:dark:bg-circularDarkSm
            
            "
      >
        <motion.div
          className="flex items-center justify-center rounded-full font-semibold bg-dark text-light p-8 shadow-dark dark:bg-light dark:text-dark
                lg:p-6 md:p-4 xs:text-xs xs:p-2
                
                "
          whileHover={{ scale: 1.05 }}
        >
          Tech-Stack
        </motion.div>

        {loading ? (
          <div className="absolute">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        ) : (
          skills.map((skill, index) => (
            <Skill key={index} name={skill.name} x={skill.x} y={skill.y} />
          ))
        )}
      </div>
    </>
  );
};

export default Skills;
