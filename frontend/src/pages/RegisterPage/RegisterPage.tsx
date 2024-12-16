import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, registerUser } from "../../redux/operations";
import styles from "../FormPage.module.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterPage: React.FC = () => {
  // const [name, setName] = useState("");
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();

  // const { status, error } = useSelector((state: RootState) => state.auth);

  // const handleRegister = async () => {
  //   try {
  //     const response = await dispatch(
  //       registerUser({ name, username, email, password })
  //     ).unwrap();
  //     console.log("Ответ от сервера:", response);

  //     if (response.role === "user") {
  //       navigate("/user-profile");
  //     } else {
  //       console.error("Неожиданная роль пользователя:", response.role);
  //     }
  //   } catch (err) {
  //     console.error("Ошибка при регистрации:", err);
  //   }
  // };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  interface RegisterValues {
    name: string;
    username: string;
    email: string;
    password: string;
  }

  const handleSubmit = async (values: RegisterValues): Promise<void> => {
    try {
      const response = await dispatch(registerUser(values)).unwrap();
      // console.log("Full response after registration:", response);
      const role = response?.user?.role || response?.user?.user?.role;
      // console.log("Extracted role:", role);

      if (role === "user") {
        localStorage.setItem("access_token", response.access_token);
        // console.log("Access token saved:", response.access_token);
        dispatch(fetchCurrentUser());

        navigate("/user-profile");
      } else {
        console.error("Unexpected role:", role);
      }
    } catch (err) {
      console.error("Error during registration:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <Formik
        initialValues={{ name: "", username: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={styles.form}>
          <Field
            type="text"
            name="name"
            placeholder="Name"
            className={styles.input}
          />
          <ErrorMessage name="name" component="div" className={styles.error} />

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
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
          />
          <ErrorMessage name="email" component="div" className={styles.error} />

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
            {status === "loading" ? "Registering..." : "Register"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </Form>
      </Formik>
    </div>
  );
};
export default RegisterPage;
