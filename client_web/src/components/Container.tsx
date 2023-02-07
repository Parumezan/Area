interface PropsType {
  children: React.ReactNode;
}

export default function Container(props: PropsType) {
  return (
    <div className="w-full h-full my-auto p-4 flex space-x-4 backdrop-blur-sm bg-opacity-20 bg-indigo-800 border border-indigo-900 rounded-2xl m-auto overflow-hidden">
      <div className="w-full h-full">{props.children}</div>
    </div>
  );
}
