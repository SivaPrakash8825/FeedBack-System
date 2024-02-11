import { ReactNode } from "react";
import useRole from "../store/useRole";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
  shouldBeAdmin?: boolean;
};

const ProtectedRoute = ({ children, shouldBeAdmin = false }: Props) => {
  const role = useRole((state) => state.role);

  if (!role) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      {shouldBeAdmin ? (
        role === "admin" ? (
          children
        ) : (
          <Navigate to={"/"} />
        )
      ) : role === "user" ? (
        children
      ) : (
        <Navigate to={"/"} />
      )}
    </>
    // children
  );
};

export default ProtectedRoute;
