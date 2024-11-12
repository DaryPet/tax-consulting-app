import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = lazy(() => import("./pages/HomePage"));

const ServicePage = lazy(() => import("./pages/ServicePage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));
const UserPage = lazy(() => import("./pages/UserPage/UserPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div>
      <Layout>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/user-profile"
              element={user ? <UserPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin"
              element={
                user && user.role === "admin" ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
      <ToastContainer />
    </div>
  );
}
