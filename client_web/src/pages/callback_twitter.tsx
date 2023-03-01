import Button from "@/components/Button";
import Container from "@/components/Container";
import ErrorBlock from "@/components/ErrorBlock";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Callback = ({}) => {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const query = new URLSearchParams(window.location.search);
      const oauthToken = query.get("oauth_token");
      const oauthVerifier = query.get("oauth_verifier");
      const req = {
        oauthToken,
        oauthVerifier,
      };
      fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/twitter/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(req),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
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
};

export default Callback;
