import React, { useState } from "react";
import InputTextField from "../components/InputTextField";

type Props = {};

const GeneratePage = (props: Props) => {
  const [year, setYear] = useState("");

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-6 py-4">
      <section className="mx-auto w-full max-w-4xl p-3">
        <h1 className="text-2xl font-semibold">Generate User Credentials</h1>
        <div className="mt-6 flex flex-col gap-3 rounded-md border-2 border-black p-5 ">
          <InputTextField label="Academic Year" />
        </div>
      </section>
    </main>
  );
};

export default GeneratePage;
