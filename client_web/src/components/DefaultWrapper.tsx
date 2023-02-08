import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Header from "@/components/Header";

interface PropsType {
  children: React.ReactNode;
}

export default function DefaultWrapper(props: PropsType) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Area</title>
        <meta name="description" content="app" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div className="absolute w-screen h-screen -z-10 bg-[url('/assets/background.png')] bg-contain"></div>
      <Header />
      <main className="flex-1">{props.children}</main>
    </>
  );
}
