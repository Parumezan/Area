import Container from "./Container";

interface PropsType {
  children: React.ReactNode;
}

export default function Popup(props: PropsType) {
  return (
    <div className="fixed w-full h-full flex flex-col justify-center bg-black bg-opacity-50">
      <div className="w-1/4 mx-auto">
        <Container>
          <div className="w-full h-full">{props.children}</div>
        </Container>
      </div>
    </div>
  );
}
