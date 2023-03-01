import Button from "@/components/Button";
import Container from "@/components/Container";
import ErrorBlock from "@/components/ErrorBlock";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function CallbackPage({ code }) {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch(`https://oauth2.googleapis.com/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `code=${code}&client_id=${
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
          }&client_secret=${
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
          }&redirect_uri=${encodeURIComponent(
            process.env.NEXT_PUBLIC_OAUTH2_REDIRECT_URI + "_google"
          )}&grant_type=authorization_code`,
        });
        const data = await response.json();

        localStorage.setItem("google_token", data.access_token);

        fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/auth/oauthGoogle`, {
          method: "POST",
          body: JSON.stringify({
            oauthToken: data.access_token,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then(async (response) => {
          if (response.status === 401 || response.status === 403) {
            alert("Wrong email or password");
          } else {
            const json = await response.json();
            localStorage.setItem("token", json.access_token);
          }
        });
        setLoading(false);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    fetchAccessToken();
  }, [code]);

  return (
    <div>
      <div className="absolute w-screen h-screen -z-10 bg-[url('/assets/background.png')] bg-cover"></div>
      {loading && (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-fit">
            <Loader text="Loading ..." />
          </div>
        </div>
      )}
      {!loading && error && <ErrorBlock text="An error occured." />}
      {!loading && !error && (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-fit">
            <Container>
              <div className="flex flex-col justify-between space-y-2 p-2">
                <div className="text-white text-3xl">Connexion réussie !</div>
                <div className="flex flex-row justify-center"></div>
                <Button onClick={() => router.push("/services")}>Retour</Button>
              </div>
            </Container>
          </div>
        </div>
      )}
    </div>
  );
}

CallbackPage.getInitialProps = async (ctx) => {
  const { query } = ctx;
  return { code: query.code };
};

export default CallbackPage;
