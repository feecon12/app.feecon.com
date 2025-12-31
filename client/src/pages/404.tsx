import { Layout } from "@/components/Layout";
import Link from "next/link";

export default function Custom404() {
  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-dark text-center p-8">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <span className="inline-block px-6 py-2 bg-primary text-light rounded hover:bg-primary/80 transition-colors cursor-pointer">
            Go Home
          </span>
        </Link>
      </div>
    </Layout>
  );
}
