// create a callback function who call the back function /twitter/callback with the req parameter
//
import React, { useEffect } from "react";

const Callback = ({}) => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const oauthToken = query.get("oauth_token");
    const oauthVerifier = query.get("oauth_verifier");
    const req = {
      oauthToken,
      oauthVerifier,
    };
    fetch("http://localhost:8080/twitter/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(req),
    });
  }, []);
  return (
    <div>
      <h1>Callback</h1>
    </div>
  );
};

export default Callback;
