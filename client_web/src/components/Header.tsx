import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  async function logout() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACK_URL}/auth/logout`,
      {
        method: "GET",
      }
    );
    if (response.status === 401 || response.status === 403)
      alert("You somehow aren't logged-in when trying to logout");
    router.push("/login");
  }

  const getLastTweet = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/twitter/getTweet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(username),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  async function twitter() {
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
      const data = await res.json();
      router.push(
        `https://api.twitter.com/oauth/authorize?oauth_token=${data.oauth_token}&scope=write`
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="flex w-screen bg-purple-header">
        <Image src="/assets/logo.png" alt="logo" width="90" height="90" />
        {/* <button className="ml-auto mr-auto" onClick={() => twitter()}>
          <Image
            src="/assets/twitter.png"
            alt="twitter"
            width="45"
            height="45"
          />
        </button> */}
        <button
          className="bg-white text-black px-4 py-2 ml-auto mr-2 mt-auto mb-auto rounded-full"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </>
  );
}
