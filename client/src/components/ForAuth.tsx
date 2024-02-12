import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRole from "../store/useRole";

const ForAuth = () => {
  const setRole = useRole((state) => state.setRole);
  const navigate = useNavigate();

  // sets Role using session
  const adminChecker = async () => {
    try {
      const { data: session } = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/me`,
        {
          withCredentials: true,
        },
      );
      if (session.role == "admin") {
        setRole("admin");
        navigate("/admin");
      } else if (session.role == "user") {
        setRole("user");
        navigate(`/feedback/${session.username}`);
      } else {
        setRole(null);
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    adminChecker();
  }, []);
  return <></>;
};

export default ForAuth;
