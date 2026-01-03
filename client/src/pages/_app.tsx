import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ChatWidget } from "@/components/ChatWidget";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { Nunito } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../contexts/AuthContext";
import { DataProvider } from "../contexts/DataContext";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
        <DataProvider>
          <main
            className={`${nunito.variable} font-nunito bg-light  dark:bg-dark w-full min-h-screen`}
          >
            <NavBar />

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            {isAdminRoute ? (
              <ProtectedRoute requireAuth={true}>
                <Component {...pageProps} />
              </ProtectedRoute>
            ) : (
              <Component {...pageProps} />
            )}

            <Footer />

            {/* AI Chat Widget - available on all pages */}
            <ChatWidget />
          </main>
        </DataProvider>
      </AuthProvider>
    </>
  );
}
