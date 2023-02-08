import Image from "next/image";
import { useRouter } from "next/router";
import Button from "./Button";

interface Page {
  name: string;
  path: string;
}

export default function Header() {
  const router = useRouter();

  const pages: Page[] = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Services", path: "/services" },
  ];

  function logout() {
    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/auth/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.status === 401 || response.status === 403)
        alert("You somehow aren't logged-in when trying to logout");
      localStorage.removeItem("token");
      router.push("/login");
    });
  }

  return (
    <div className="flex flex-row justify-between w-screen bg-gray-800 bg-opacity-75 backdrop-blur-sm pr-5">
      <div className="flex flex-row space-x-10">
        <Image src="/assets/logo.png" alt="logo" width="90" height="90" />
        {pages.map((page) => (
          <div key={page.name} className="my-auto">
            <Button onClick={() => router.push(page.path)}>{page.name}</Button>
          </div>
        ))}
      </div>

      <div className="my-auto">
        <Button onClick={() => logout()}>Logout</Button>
      </div>
    </div>
  );
}
