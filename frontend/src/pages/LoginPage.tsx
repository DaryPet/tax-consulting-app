// import React from "react";

// const LoginPage: React.FC = () => {
//   return (
//     <div>
//       <h1>Welcome to the Login Page</h1>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { AppDispatch, RootState } from "../redux/store";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ username, password }));
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin} disabled={status === "loading"}>
        {status === "loading" ? "Logging in..." : "Login"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
