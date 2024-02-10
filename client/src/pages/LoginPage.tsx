import { useEffect, useState } from "react";
import LOGO from "../assets/logo.jpg";
import InputTextField from "../components/InputTextField";
import RadioField from "../components/RadioField";
import Button from "../components/Button";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import useRole from "../store/useRole";

type Props = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const LoginPage = ({ setUsername, username }: Props) => {
  const [option, setOption] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const setOptionFun = (val: string | null) => {
    setOption(val);
  };

  // useEffect(() => {
  //   role == "admin"
  //     ? navigate("/admin")
  //     : role == "user"
  //       ? navigate(`/feedback`)
  //       : navigate("/");
  // }, [role]);

  const handleSubmit = async () => {
    // console.log("clicked");
    if (username.trim() != "" && password.trim() != "") {
      console.log("in");
      try {
        const { data: checkRole } = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/loginAuth`,
          {
            username: username, // AD1323UNaN
            password: password, // AD@28NaNNaN131
          },
          {
            withCredentials: true,
          },
        );
        console.log(checkRole);
        if (checkRole == "admin") {
          // Admin
          console.log("Yeah Admin");
          setRole("admin");
          return navigate("/admin");
          // return;
        } else if (checkRole == "user") {
          // User
          console.log("Yeah User");
          setRole("user");
          return navigate(
            `/feedback/${username}`,
            // {
            //   state: { username, password },
            // }
          );
        } else {
          console.log("Not Both");
          alert("Who are you?");
        }
      } catch (error) {
        console.log(error.request.response);
      }
    } else {
      alert("Enter Valid Details!");
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-10 bg-white px-10 py-4 ">
      {/* LOGO */}
      <img src={LOGO} alt="logo" className="mx-auto h-36" />
      {/* Title */}
      <h3 className="text-2xl font-semibold">Online Feedback System</h3>
      {/* Box */}
      <section className="borde-2 bg-gra-50 flex w-10/12 flex-col gap-6 rounded-lg border-gray-100 p-8 lg:w-4/12 2xl:w-3/12">
        <InputTextField
          value={username}
          setValue={setUsername}
          label="Username"
        />
        <InputTextField
          value={password}
          setValue={setPassword}
          label="Password"
        />

        {username.trim() !== "admin" && (
          <RadioField
            option={option}
            setOption={setOptionFun}
            options={["day scholar", "hosteller"]}
          />
        )}
        <Button onClick={handleSubmit} title="Login" />
      </section>
    </main>
  );
};

export default LoginPage;
