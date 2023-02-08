import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Button from "./Button";
import Container from "./Container";

interface PropsType {
  text: string;
}

export default function ErrorBlock(props: PropsType) {
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex flex-col justify-center">
      <div className="w-fit m-auto">
        <Container>
          <div className="flex flex-col space-y-3">
            <div className="flex flex-row px-2 space-x-5">
              <ExclamationTriangleIcon className="h-20 w-20 text-white mx-auto" />
              <div className="text-white text-2xl my-auto">{props.text}</div>
            </div>
            <Button onClick={() => router.push("/services")}>Retour</Button>
          </div>
        </Container>
      </div>
    </div>
  );
}
