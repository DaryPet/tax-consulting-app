import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsLoggedIn } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";
import { logoutUser } from "../../redux/operations";

const LogoutButton = () => {
  const [logoutInProgress, setLogoutInProgress] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logoutInProgress || !isLoggedIn) return;

    setLogoutInProgress(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
    } finally {
      setLogoutInProgress(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={logoutInProgress}>
      {isLoggedIn
        ? logoutInProgress
          ? "Logging out..."
          : "Logout"
        : "Login / Register"}
    </button>
  );
};

export default LogoutButton;
