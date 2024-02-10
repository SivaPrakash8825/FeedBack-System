import axios from "axios";
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useRole from "../store/useRole";

type Props = {
  username: string;
};

const ForAuth = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  const adminChecker = async () => {
    try {
      const { data: session } = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/me`,
        {
          withCredentials: true,
        },
      );
      // console.log(roleType);
      if (session.role == "admin") {
        // console.log("roletype", roleType);

        setRole("admin");
        // alert("admin");
        navigate("/admin");
        // <Navigate to={"/test"} />;
      } else if (session.role == "user") {
        setRole("user");
        navigate(`/feedback/${session.username}`);
        // <Navigate to={`/feedback/forauth`} />;
      } else {
        // alert("App alert .");
        setRole(null);
        navigate("/");
        // <Navigate to={"/"} />;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    adminChecker();
  }, []);
  return <div></div>;
};

export default ForAuth;
