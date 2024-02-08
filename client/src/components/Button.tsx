import Spinner from "./Spinner";

type Props = {
  title: string;
  loading?: boolean;
  type?: "primary" | "secondary";
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = ({ title, loading, type = "primary", onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-center gap-4 rounded-md border-2  border-black py-2  font-semibold active:bg-black/80 active:transition-all active:duration-150
      ${type === "primary" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <p>{title}</p>
      {loading && <Spinner size="sm" type={type} />}
      {/* <button onClick={}></button> */}
    </button>
  );
};

export default Button;
