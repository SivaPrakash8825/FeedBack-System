import Spinner from "./Spinner";

type Props = {
  title: string;
  loading?: boolean;
  type?: "primary" | "secondary";
};

const Button = ({ title, loading, type = "primary" }: Props) => {
  return (
    <div
      className={`flex w-full items-center justify-center gap-4 rounded-md border-2 border-black  py-2 font-semibold 
      ${type === "primary" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <p>{title}</p>
      {loading && <Spinner size="sm" type={type} />}
    </div>
  );
};

export default Button;
