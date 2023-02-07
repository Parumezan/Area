import Container from "./Container";

interface PropsType {
  text: string;
}

export default function Loader(props: PropsType) {
  return (
    <Container>
      <div className="flex justify-center space-x-5">
        <div className="min-w-[40px] min-h-[40px] rounded-full border-4 border-gray-400 border-t-indigo-800 animate-spin"></div>
        <div className="my-auto text-white">{props.text}</div>
      </div>
    </Container>
  );
}
