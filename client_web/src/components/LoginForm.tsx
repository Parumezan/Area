import { LockClosedIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type Form = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Form>({
    email: "",
    password: "",
  });

  function handleInput(e) {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  }

  async function fetchData(form) {
    form.preventDefault();

    const formURL = form.target.action;

    fetch(formURL, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          alert("Wrong email or password");
        } else {
          const json = await response.json();
          localStorage.setItem("token", json.access_token);
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col self-center rounded-xl bg-gray-login px-8 pt-6 pb-8 shadow-md">
        <div className="text-center text-4xl font-light text-white">
          Heureux de vous revoir !
          <form
            className="mt-9 space-y-6"
            action={`${process.env.NEXT_PUBLIC_BACK_URL}/auth/login`}
            method="POST"
            onSubmit={fetchData}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className=" -space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Adresse mail
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-800 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Adresse mail"
                  onChange={handleInput}
                  value={formData.email}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de Passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-800 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Mot de passe"
                  onChange={handleInput}
                  value={formData.password}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Se connecter
              </button>
            </div>
            <div className="text-center text-sm text-white">
              Nouveau sur l'Area ?
              <Link className="text-blue-500" href="/register">
                {" "}
                Créer un compte.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
