import axios from "axios";
import LOGO from "../assets/logo.jpg";
import Button from "./Button";
import useRole from "../store/useRole";
import useUserDetails from "../store/useUserDetails";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const Header = (props: Props) => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const { setUserDetails, userDetails: user } = useUserDetails();
  const logout = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_ENDPOINT}/logout`,
      {
        withCredentials: true,
      },
    );
    console.log(data);
    setRole(null);
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between border-b-2 border-gray-500 px-6 py-2">
      {/* LOGO */}
      <img src={LOGO} alt="logo" className="h-16" />
      {/* Title */}
      {role == "admin" ? (
        <h1>Admin Header</h1>
      ) : (
        <h1 className="text-2xl font-semibold">{`${user?.year} ${user?.dept} ${user?.section} Feedback Entry ${user?.academicyr}`}</h1>
      )}
      <div className="flex items-center gap-4">
        <Button title="Home" />
        <Button onClick={logout} title="Logout" type="secondary" />
      </div>
    </header>
  );
};

export default Header;
