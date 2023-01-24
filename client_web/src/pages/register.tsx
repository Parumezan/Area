import Head from "next/head";
import Image from "next/image";

import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <div>
      <Head>
        <title>Area</title>
        <meta name="description" content="app" />
        <link rel="icon" href="/icon.ico" />
      </Head>

      <div className="bg-gray-backlogin">
        <div className="fixed bottom-[-1px] resize-none">
          <Image
            src="/assets/background.png"
            alt="background"
            width="1920"
            height="278"
          />
        </div>
      </div>

      <div className="h-screen w-screen bg-gray-backlogin">
        <div className="flex h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            <div className="flex flex-row justify-center">
              <div className="my-auto pr-5">
                <Image
                  src="/assets/logo.png"
                  alt="Area"
                  width={124}
                  height={100}
                />
              </div>
              <h2 className="my-auto text-[60px] font-light text-white">
                Area
              </h2>
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
