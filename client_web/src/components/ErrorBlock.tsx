import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import Container from "./Container";

interface PropsType {
  text: string;
}

export default function ErrorBlock(props: PropsType) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center">
      <div className="w-fit m-auto">
        <Container>
          <div className="flex flex-row px-2 space-x-5">
            <ExclamationTriangleIcon className="h-20 w-20 group-hover:text-indigo-400 mx-auto" />
            <div className="text-white text-2xl my-auto">{props.text}</div>
          </div>
        </Container>
      </div>
    </div>
  );
}
