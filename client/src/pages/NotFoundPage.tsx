import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRole from "../store/useRole";
import axios from "axios";

type Props = {};

const NotFoundPage = (props: Props) => {
  // const { role, setRole } = useRole();
  // const navigate = useNavigate();
  // const logout = async () => {
  //   const { data } = await axios.get(
  //     `${import.meta.env.VITE_ENDPOINT}/logout`,
  //     {
  //       withCredentials: true,
  //     },
  //   );
  //   alert("NotFOunDpage");
  //   console.log(data);
  //   setRole(null);
  //   navigate("/");
  // };
  // useEffect(() => {
  //   logout();
  // }, []);

  return <div>NotFoundPage</div>;
};

export default NotFoundPage;
