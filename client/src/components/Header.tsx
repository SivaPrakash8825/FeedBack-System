import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.jpg";
import useRole from "../store/useRole";
import useUserDetails from "../store/useUserDetails";
import Button from "./Button";

const Header = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const { userDetails: user } = useUserDetails();

  const logout = async () => {
    await axios.get(`${import.meta.env.VITE_ENDPOINT}/logout`, {
      withCredentials: true,
    });
    setRole(null);
    navigate("/");
  };

  const redirectToHome =
    role === "admin" ? "/admin" : `/feedback/${user?.username}`;

  return (
    <header className="flex h-24 items-center justify-between gap-2 border-b-2 border-gray-500 px-6 py-2">
      {/* LOGO */}
      <Link to={redirectToHome}>
        <img src={LOGO} alt="logo" className="h-16" />
      </Link>
      {/* Title */}
      {role == "admin" ? (
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      ) : (
        <h1 className="text-xl font-semibold">{`${user?.year || ""} ${user?.dept || ""} ${user?.section || ""} Feedback Entry ${user?.academicyr || ""}`}</h1>
      )}
      <div className="flex items-center gap-4">
        <Link to={redirectToHome}>
          <Button title="Home" />
        </Link>
        <Button onClick={logout} title="Logout" type="secondary" />
      </div>
    </header>
  );
};

export default Header;
