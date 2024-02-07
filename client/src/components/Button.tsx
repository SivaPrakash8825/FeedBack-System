import Spinner from "./Spinner";

type Props = {
  title: string;
  loading?: boolean;
  type?: "primary" | "secondary";
  width?: "full" | "normal";
};

const Button = ({
  title,
  loading,
  type = "primary",
  width = "normal",
}: Props) => {
  return (
    <div
      className={`flex items-center justify-center gap-4 rounded-md border-2 border-black py-2 font-semibold 
      ${type === "primary" ? "bg-black text-white" : "bg-white text-black"} ${width === "full" ? "w-full" : "px-6"}`}
    >
      <p>{title}</p>
      {loading && <Spinner size="sm" type={type} />}
    </div>
  );
};

export default Button;
