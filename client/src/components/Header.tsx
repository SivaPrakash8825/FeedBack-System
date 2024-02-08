import LOGO from "../assets/logo.jpg";
import Button from "./Button";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="flex items-center justify-between border-b-2 border-gray-500 px-6 py-2">
      {/* LOGO */}
      <img src={LOGO} alt="logo" className="h-16" />
      {/* Title */}
      <h1 className="text-2xl font-semibold">Feedback Report</h1>
      <div className="flex items-center gap-4">
        <Button title="Home" />
        <Button title="Logout" type="secondary" />
      </div>
    </header>
  );
};

export default Header;
