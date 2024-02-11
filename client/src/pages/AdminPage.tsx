import axios from "axios";
import React, { useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

type Props = {};

const AdminPage = (props: Props) => {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        title="Generate Page"
        onClick={() => navigate("/admin/generate")}
      />
      <Button
        title="report gen Page"
        onClick={() => navigate("/admin/reportgenerate")}
      />
    </div>
  );
};

export default AdminPage;
   