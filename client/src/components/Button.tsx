import Spinner from "./Spinner";

type Props = {
  title: string;
  loading?: boolean;
  type?: "primary" | "secondary";
  width?: "full" | "normal";
  onClick?: () => void;
  disable?: boolean;
};

const Button = ({
  title,
  loading,
  type = "primary",
  width = "normal",
  onClick,
  disable = false,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-4 ${disable ? "pointer-events-none  opacity-[.4]" : "cursor-pointer"}  rounded-md border-2 border-black py-2 font-semibold transition-all
      ${type === "primary" ? "bg-black text-white hover:bg-black/70 focus:bg-black/70" : "bg-white text-black hover:bg-gray-200 focus:bg-gray-200"} ${width === "full" ? "w-full" : "mx-auto w-max px-6"}  `}
    >
      <p className="select-none">{title}</p>
      {loading && <Spinner size="sm" type={type} />}
    </button>
  );
};

export default Button;
