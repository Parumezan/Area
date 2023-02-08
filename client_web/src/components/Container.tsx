interface PropsType {
  children: React.ReactNode;
}

export default function Container(props: PropsType) {
  return (
    <div className="w-full h-full my-auto p-4 flex space-x-4 backdrop-blur-sm bg-opacity-75 bg-gray-800 border border-black rounded-2xl m-auto overflow-hidden hover:bg-opacity-80 cursor-pointer transition">
      <div className="w-full h-full">{props.children}</div>
    </div>
  );
}
