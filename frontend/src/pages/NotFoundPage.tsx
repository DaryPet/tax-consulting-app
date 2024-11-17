import React from "react";
import { Link } from "react-router-dom";
import notFoundImage from "../assets/background/notFound.png";

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>This page doesn't exsist</p>
      <Link to="/">Go back to main page</Link>
      <img
        src={notFoundImage}
        alt="Page Not Found"
        style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }}
      />
    </div>
  );
};

export default NotFoundPage;
