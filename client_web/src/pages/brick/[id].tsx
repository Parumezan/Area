import DefaultWrapper from "@/components/DefaultWrapper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";

import type { ActionProps } from "@/types/type";
import Popup from "@/components/Popup";

export default function Brick() {
  const router = useRouter();
  const id = router.query;

  async function fetchData() {
    await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/bricks/${id.id}`, {
      method: "GET",
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.push("/login");
          window.location.reload();
        }
        if (response.status !== 404) {
          const json = await response.json();
          // setBricks(json);
        }
      })
      .catch(() => {});
  }

  useEffect(() => {
    fetchData();
  });

  return (
    <div>
      <DefaultWrapper>
        <div></div>
      </DefaultWrapper>
    </div>
  );
}
