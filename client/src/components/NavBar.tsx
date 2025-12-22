// @ts-nocheck
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import useThemeSwitcher from "./hooks/useThemeSwitcher";
import {
  DribbbleIcon,
  GithubIcon,
  LinkedInIcon,
  MoonIcon,
  PinterestIcon,
  SunIcon,
  TwitterIcon,
} from "./Icons";

interface CustomLinkProps {
  href: string;
  title: string;
  className?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  title,
  className = "",
}) => {
  const router = useRouter();

  return (
    <Link href={href} className={`${className} relative group`}>
      {title}

      <span
        className={`
             h-[1px] inline-block bg-dark 
             absolute left-0 -bottom-0.5 
             group-hover:w-full transition-[width] ease duration-300
             ${router.asPath === href ? "w-full" : "w-0"} dark:bg-light
             `}
      >
        &nbsp;
      </span>
    </Link>
  );
};

interface CustomMobileLinkProps {
  href: string;
  title: string;
  className?: string;
  toggle: () => void;
}

const CustomMobileLink: React.FC<CustomMobileLinkProps> = ({
  href,
  title,
  className = "",
  toggle,
}) => {
  const router = useRouter();

  const handleClick = () => {
    toggle();
    router.push(href);
  };

  return (
    <button
      className={`${className} relative group text-light dark:text-dark my-2`}
      onClick={handleClick}
    >
      {title}

      <span
        className={`
             h-[1px] inline-block bg-light dark:bg-dark 
             absolute left-0 -bottom-0.5 
             group-hover:w-full transition-[width] ease duration-300
             ${router.asPath === href ? "w-full" : "w-0"} dark:bg-dark 
             `}
      >
        &nbsp;
      </span>
    </button>
  );
};

interface DropdownMenuProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center group"
      >
        {title}
        <svg
          className={`ml-1 w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>

        <span
          className={`
            h-[1px] inline-block bg-dark 
            absolute left-0 -bottom-0.5 
            group-hover:w-full transition-[width] ease duration-300
            w-0 dark:bg-light
          `}
        >
          &nbsp;
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 py-2 w-48 bg-light dark:bg-dark rounded-md shadow-lg z-20 border border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  href: string;
  title: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {title}
    </Link>
  );
};

interface MobileDropdownProps {
  title: string;
  children: ReactNode;
  toggle: () => void;
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({
  title,
  children,
  toggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={handleToggle}
        className="relative group text-light dark:text-dark my-2 flex items-center"
      >
        {title}
        <svg
          className={`ml-1 w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="flex flex-col items-center w-full py-1 mb-2">
          {children}
        </div>
      )}
    </div>
  );
};

export const NavBar: React.FC = () => {
  const [mode, setMode] = useThemeSwitcher();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <header className="w-full px-32 py-8 relative z-10 font-medium flex items-center justify-between dark:text-light lg:px-16 md:px-12 sm:px-8">
      <button
        className=" flex-col justify-center items-center hidden lg:flex"
        onClick={handleClick}
      >
        <span
          className={`bg-dark dark:bg-light  block transistion-all duration-300 ease-out h-0.5 w-6 rounded-sm -translate-y-0.5 ${
            isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`bg-dark dark:bg-light  block transistion-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`bg-dark  dark:bg-light block transistion-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
          }`}
        ></span>
      </button>

      {/* Desktop view */}
      <div className="w-full flex justify-between items-center lg:hidden">
        {/* Navigation Links - Show different links based on auth status */}
        <nav>
          {isAuthenticated ? (
            <>
              <CustomLink
                href="/dashboard"
                title="Dashboard"
                className="mr-4"
              />
            </>
          ) : (
            <>
              <CustomLink href="/" title="Home" className="mr-4" />
              <CustomLink href="/projects" title="Projects" className="mx-4" />
              <CustomLink href="/blog" title="Blog" className="mx-4" />
              <DropdownMenu title="AI Solutions" className="inline-block mx-4">
                <DropdownItem href="/sumText" title="Summary Generator" />
                <DropdownItem href="/fotofunic" title="Fotofunic AI" />
                <DropdownItem
                  href="/twitterBioGenerator"
                  title="Twitter Bio Generator"
                />
              </DropdownMenu>
              <CustomLink
                href="/contactus"
                title="Contact Me"
                className="ml-4"
              />
            </>
          )}
        </nav>

        <nav className="flex items-center justify-center flex-wrap ">
          {/* Authentication Links */}
          {isAuthenticated && (
            <div className="flex items-center mr-4">
              <span className="text-sm mr-3">
                Welcome, {user?.username || "User"}!
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-primary text-light px-3 py-1 rounded-md hover:bg-primary/80 transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          {/* Social Icons - Only show when not authenticated */}
          {!isAuthenticated && (
            <>
              <motion.a
                href="https://twitter.com"
                target={"_blank"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 mr-3"
              >
                <TwitterIcon />
              </motion.a>
              <motion.a
                href="https://github.com/feecon12"
                target={"_blank"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 mx-3"
              >
                <GithubIcon />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/feecon-behera-574009188/"
                target={"_blank"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 m-3"
              >
                <LinkedInIcon />
              </motion.a>
              <motion.a
                href=""
                target={"_blank"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 mx-3 bg-light rounded-full"
              >
                <PinterestIcon />
              </motion.a>
              <motion.a
                href=""
                target={"_blank"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 ml-3"
              >
                <DribbbleIcon />
              </motion.a>
            </>
          )}

          <button
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            className={`ml-5 flex items-center justify-center rounded-full p-0.5 
                        ${
                          mode === "light"
                            ? "bg-dark text-light"
                            : "bg-light text-dark"
                        }
                    
                        `}
          >
            {mode === "dark" ? (
              <MoonIcon className={"fill-dark"} />
            ) : (
              <SunIcon className={"fill-dark"} />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile view */}
      {isOpen ? (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1 }}
            className="min-w-[70vw] flex flex-col justify-between items-center fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                bg-dark/90 dark:bg-light/75 rounded-lg backdrop-blur-md py-32"
          >
            {/* Page navigations */}
            <nav className="flex items-center flex-col justify-center">
              {isAuthenticated ? (
                <>
                  <CustomMobileLink
                    href="/dashboard"
                    title="Dashboard"
                    className=""
                    toggle={handleClick}
                  />
                </>
              ) : (
                <>
                  <CustomMobileLink
                    href="/"
                    title="Home"
                    className=""
                    toggle={handleClick}
                  />
                  <CustomMobileLink
                    href="/projects"
                    title="Projects"
                    className=""
                    toggle={handleClick}
                  />
                  <CustomMobileLink
                    href="/blog"
                    title="Blog"
                    className=""
                    toggle={handleClick}
                  />
                  <MobileDropdown title="AI Solutions" toggle={handleClick}>
                    <CustomMobileLink
                      href="/sumText"
                      title="Summary Generator"
                      className="text-sm"
                      toggle={handleClick}
                    />
                    <CustomMobileLink
                      href="/fotofunic"
                      title="Fotofunic AI"
                      className="text-sm"
                      toggle={handleClick}
                    />
                    <CustomMobileLink
                      href="/twitterBioGenerator"
                      title="Twitter Bio Generator"
                      className="text-sm"
                      toggle={handleClick}
                    />
                  </MobileDropdown>
                  <CustomMobileLink
                    href="/contactus"
                    title="Contact Me"
                    className=""
                    toggle={handleClick}
                  />
                </>
              )}

              {/* Mobile Authentication Links */}
              {isAuthenticated && (
                <div className="flex flex-col items-center mt-4">
                  <span className="text-light dark:text-dark text-sm mb-2">
                    Welcome, {user?.username || "User"}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-light dark:text-dark bg-primary px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* Social Icons - Only show when not authenticated */}
            {!isAuthenticated && (
              <nav className="flex items-center justify-center flex-wrap mt-2">
                <motion.a
                  href="https://twitter.com"
                  target={"_blank"}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 mr-3 sm:mx-1"
                >
                  <TwitterIcon />
                </motion.a>
                <motion.a
                  href="https://github.com/feecon12"
                  target={"_blank"}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 mx-3 bg-light rounded-full dark:bg-dark sm:mx-1"
                >
                  <GithubIcon />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/feecon-behera-574009188/"
                  target={"_blank"}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 m-3 sm:mx-1"
                >
                  <LinkedInIcon />
                </motion.a>
                <motion.a
                  href=""
                  target={"_blank"}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 mx-3 bg-light rounded-full sm:mx-1"
                >
                  <PinterestIcon />
                </motion.a>
                <motion.a
                  href=""
                  target={"_blank"}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 ml-3 sm:mx-1"
                >
                  <DribbbleIcon />
                </motion.a>
              </nav>
            )}
            <button
              onClick={() => setMode(mode === "light" ? "dark" : "light")}
              className={`ml-1 flex items-center justify-center rounded-full p-0.5 mt-4
                                ${
                                  mode === "light"
                                    ? "bg-light text-dark"
                                    : "bg-dark text-light"
                                }
                            `}
            >
              {mode === "dark" ? (
                <MoonIcon className={"fill-dark"} />
              ) : (
                <SunIcon className={"fill-dark"} />
              )}
            </button>
          </motion.div>
        </>
      ) : null}
    </header>
  );
};
