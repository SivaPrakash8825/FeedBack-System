import { useState } from "react";
import LOGO from "../assets/logo.jpg";
import InputTextField from "../components/InputTextField";
import RadioField from "../components/RadioField";
import Button from "../components/Button";

// type Props = {};

const LoginPage = () => {
  const [option, setOption] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
            setOption={setOption}
            options={["day scholar", "hosteller"]}
          />
        )}
        <Button title="Login" />
      </section>
    </main>
  );
};

export default LoginPage;
