import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.jpg";
import Button from "../components/Button";
import InputTextField from "../components/InputTextField";
import RadioField from "../components/RadioField";
import useRole from "../store/useRole";
import useToast from "../store/useToast";

type Props = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const LoginPage = ({ setUsername, username }: Props) => {
  const [option, setOption] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const setRole = useRole((state) => state.setRole);
  const setToast = useToast((state) => state.setToast);
  const setOptionFun = (val: string | null) => {
    setOption(val);
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (username.trim() != "" && password.trim() != "") {
      try {
        setLoading(true);
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
        if (checkRole == "admin") {
          setRole("admin");
          return navigate("/admin");
        } else if (checkRole == "user") {
          if (!option) {
            setToast({
              msg: "Choose Hosteller or Day Scholar",
              variant: "error",
            });
          } else {
            setRole("user");
            return navigate(`/feedback/${username}`);
          }
        } else {
          setToast({ msg: "Invalid Credentials", variant: "error" });
        }
      } catch (error) {
        console.log(error.request.response);
      } finally {
        setLoading(false);
      }
    } else {
      setToast({
        msg: "Fill All Details !!",
        variant: "error",
      });
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-10 bg-white px-10 py-4 ">
      {/* LOGO */}
      <img src={LOGO} alt="logo" className="mx-auto h-36" />
      {/* Title */}
      <h3 className="text-2xl font-semibold">Online Feedback System</h3>
      {/* Box */}
      <section className="flex w-10/12 flex-col gap-6 rounded-lg border-2 border-gray-200 bg-gray-50 p-8 lg:w-4/12 2xl:w-3/12">
        <InputTextField
          value={username}
          setValue={setUsername}
          label="Username"
        />
        <InputTextField
          value={password}
          setValue={setPassword}
          label="Password"
          type="password"
        />

        {!username.trim().toLowerCase().includes("admin") && (
          <RadioField
            option={option}
            setOption={setOptionFun}
            options={["day scholar", "hosteller"]}
          />
        )}
        <Button
          width="full"
          onClick={handleSubmit}
          title="Login"
          loading={loading}
        />
      </section>
    </main>
  );
};

export default LoginPage;
