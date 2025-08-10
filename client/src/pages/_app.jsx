import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "../contexts/AuthContext";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
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
          <Component {...pageProps} />

          <Footer />
        </main>
      </AuthProvider>
    </>
  );
}
