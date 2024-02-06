type Props = {
  size?: "sm" | "md" | "lg";
  type?: "primary" | "secondary";
};

const Spinner = ({ size = "md", type = "primary" }: Props) => {
  return (
    <div
      className={`${size === "sm" ? "h-5 w-5" : size === "md" ? "h-8 w-8" : "h-10 w-10"} animate-spin rounded-full border-2 ${type === "primary" ? "border-white border-t-black" : "border-black border-t-white"} `}
    />
  );
};

export default Spinner;
