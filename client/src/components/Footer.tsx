import { useAuth } from "@/contexts/AuthContext";
import { formatLastUpdated, getBuildInfo } from "@/utils/buildInfo";
import Link from "next/link";
import React from "react";
import { Layout } from "./Layout";

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const buildInfo = getBuildInfo();
  return (
    <footer className="w-full border-t-2 border-solid border-dark dark:border-light dark:text-light sm:text-base">
      <Layout className="py-7 flex items-center justify-between lg:flex-col lg:py-6">
        <div className="flex flex-col items-start lg:items-center">
          <span>
            <time>{new Date().getFullYear()}</time> &copy; All Rights Reserved.
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Last updated on {formatLastUpdated(buildInfo.lastUpdated)}
          </span>
        </div>
        {!isAuthenticated ? (
          <>
            <Link href="/contactus" className="underline underline-offset-2">
              Say hello
            </Link>
          </>
        ) : null}
        <div>
          Build with{" "}
          <span className="text-primary dark:text-primaryDark text-2xl px-1 lg:py-2">
            &#9825;
          </span>{" "}
          by <span className="underline underline-offset-2">Feecon</span>
        </div>
      </Layout>
    </footer>
  );
};
