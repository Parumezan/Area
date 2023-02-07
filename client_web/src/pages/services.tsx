import DefaultWrapper from "@/components/DefaultWrapper";
import Image from "next/image";
import { useRouter } from "next/router";

interface Service {
  name: string;
  img: string;
  login: Function;
}

export default function Services() {
  const router = useRouter();

  const googleLogin = () => {
    router.push(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_OAUTH2_REDIRECT_URI + "_google"
      )}&response_type=code&scope=openid%20email`
    );
  };

  const services: Service[] = [
    {
      name: "Google",
      img: "/assets/google_logo.png",
      login: googleLogin,
    },
    {
      name: "Twitter",
      img: "/assets/twitter_logo.png",
      login: () => {},
    },
  ];

  return (
    <DefaultWrapper>
      <div className="grid grid-cols-2 grid-flow-row-dense w-fit bg-indigo-800 border-4 border-indigo-500 rounded-xl m-auto overflow-hidden drop-shadow-lg my-10">
        {services.map((service) => (
          <button
            onClick={() => service.login()}
            className="p-5 hover:bg-indigo-700"
            key={service.name}
          >
            <Image
              src={service.img}
              alt={service.name}
              width={75}
              height={75}
              style={{
                width: 75,
                height: 75,
              }}
            />
          </button>
        ))}
      </div>
    </DefaultWrapper>
  );
}
