import Cookies from "js-cookie";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Navigate to="login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
