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
    <div
      onClick={onClick}
      className={`flex items-center justify-center gap-4 ${disable ? "pointer-events-none  opacity-[.4]" : "cursor-pointer"}  rounded-md border-2 border-black py-2 font-semibold 
      ${type === "primary" ? "bg-black text-white" : "bg-white text-black"} ${width === "full" ? "w-full" : "px-6"}`}
    >
      <p>{title}</p>
      {loading && <Spinner size="sm" type={type} />}
      {/* <button onClick={}></button> */}
    </div>
  );
};

export default Button;
