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

  const twitterLogin = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/twitter/requestToken`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.text();
      router.push(
        `https://api.twitter.com/oauth/authorize?oauth_token=${data}&scope=write`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const twitchLoggin = () => {
    const redirectUri = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_OAUTH2_REDIRECT_URI}_twitch`
    );
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const scope = encodeURIComponent(
      "user:read:email channel:read:subscriptions user:manage:whispers user:manage:blocked_users"
    );
    router.push(
      `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
    );
  };

  const services: Service[] = [
    {
      name: "Twitter",
      img: "/assets/twitter_logo.png",
      login: twitterLogin,
    },
    {
      name: "Twitch",
      img: "/assets/twitch_logo.png",
      login: twitchLoggin,
    },
  ];

  return (
    <DefaultWrapper>
      <div className="grid grid-cols-2 grid-flow-row-dense w-fit border-4 border-gray-500 rounded-xl m-auto overflow-hidden drop-shadow-lg my-10">
        {services.map((service) => (
          <button
            onClick={() => service.login()}
            className="p-5 bg-opacity-75 bg-gray-800 hover:bg-opacity-80 transition"
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
