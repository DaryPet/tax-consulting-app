import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUsers, fetchCurrentUser } from "../../redux/operations";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "../FormPage.module.css";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { status, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .then((userResponse) => {
          if (userResponse.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/user-profile");
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await dispatch(loginUsers(values)).unwrap();
      const userResponse = await dispatch(fetchCurrentUser()).unwrap();
      if (userResponse.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user-profile");
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={styles.form}>
          <Field
            type="text"
            name="username"
            placeholder="Username"
            className={styles.input}
          />
          <ErrorMessage
            name="username"
            component="div"
            className={styles.error}
          />

          <Field
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
          />
          <ErrorMessage
            name="password"
            component="div"
            className={styles.error}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className={styles.button}
          >
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </Form>
      </Formik>
    </div>
  );
};

export default LoginPage;
