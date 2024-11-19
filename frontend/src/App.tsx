import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout/Layout";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Booking from "./components/Booking/Booking";
import Loader from "../src/components/Loader/Loader";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));

const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));
const UserPage = lazy(() => import("./pages/UserPage/UserPage"));
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));
const AllUsers = lazy(() => import("./components/AllUsers/AllUsers"));
const AllBookings = lazy(() => import("./components/AllBookings/AllBookings"));
const AllDocuments = lazy(
  () => import("./components/AllDocuments/AllDocuments")
);
const UsersDocuments = lazy(
  () => import("./components/UsersDocuments/UsersDocuments")
);

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/booking" element={<Booking />} />
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
            >
              <Route path="users" element={<AllUsers />} />
              <Route path="bookings" element={<AllBookings />} />
              <Route path="documents" element={<AllDocuments />} />
              <Route
                path="users/:userId/documents"
                element={<UsersDocuments />}
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
      <ToastContainer />
    </div>
  );
}
