interface PropsType {
  children: React.ReactNode;
}

export default function Popup(props: PropsType) {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75">
        <div className="bg-purple-500 rounded-lg p-4 m-auto w-1/2">
          <main className="flex-1">{props.children}</main>
        </div>
      </div>
    </>
  );
}
