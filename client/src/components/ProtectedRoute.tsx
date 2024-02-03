import React, { ReactNode } from "react";
import useRole from "../store/useRole";
import { redirect } from "react-router-dom";

type Props = {
  children: ReactNode;
  shouldBeAdmin?: false;
};

const ProtectedRoute = ({ children, shouldBeAdmin }: Props) => {
  const role = useRole((state) => state.role);

  if (!role) {
    return redirect("/");
  }

  return (
    <>
      {shouldBeAdmin && role === "admin" ? children : redirect("/")}
      {!shouldBeAdmin && role === "user" ? children : redirect("/")}
    </>
  );
};
