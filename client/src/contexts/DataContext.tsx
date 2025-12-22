import { AboutData, HomeContent, Project } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface Skill {
  _id: string;
  name: string;
  x: string;
  y: string;
  order: number;
}

interface DataContextType {
  // Home data
  homeData: HomeContent | null;
  setHomeData: (data: HomeContent | null) => void;
  homeLoaded: boolean;
  setHomeLoaded: (loaded: boolean) => void;

  // About data
  aboutData: AboutData | null;
  setAboutData: (data: AboutData | null) => void;
  aboutLoaded: boolean;
  setAboutLoaded: (loaded: boolean) => void;

  // Projects data
  projectsData: Project[];
  setProjectsData: (data: Project[]) => void;
  projectsLoaded: boolean;
  setProjectsLoaded: (loaded: boolean) => void;

  // Skills data
  skillsData: Skill[];
  setSkillsData: (data: Skill[]) => void;
  skillsLoaded: boolean;
  setSkillsLoaded: (loaded: boolean) => void;

  // Clear all cache (useful for logout or refresh)
  clearCache: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Home state
  const [homeData, setHomeData] = useState<HomeContent | null>(null);
  const [homeLoaded, setHomeLoaded] = useState(false);

  // About state
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [aboutLoaded, setAboutLoaded] = useState(false);

  // Projects state
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  // Skills state
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [skillsLoaded, setSkillsLoaded] = useState(false);

  const clearCache = () => {
    setHomeData(null);
    setHomeLoaded(false);
    setAboutData(null);
    setAboutLoaded(false);
    setProjectsData([]);
    setProjectsLoaded(false);
    setSkillsData([]);
    setSkillsLoaded(false);
  };

  return (
    <DataContext.Provider
      value={{
        homeData,
        setHomeData,
        homeLoaded,
        setHomeLoaded,
        aboutData,
        setAboutData,
        aboutLoaded,
        setAboutLoaded,
        projectsData,
        setProjectsData,
        projectsLoaded,
        setProjectsLoaded,
        skillsData,
        setSkillsData,
        skillsLoaded,
        setSkillsLoaded,
        clearCache,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
