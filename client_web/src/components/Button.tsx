interface PropsType {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button(props: PropsType) {
  return (
    <button
      className="bg-white border border-black text-black px-4 py-2 rounded-full"
      onClick={() => props.onClick()}
    >
      {props.children}
    </button>
  );
}
