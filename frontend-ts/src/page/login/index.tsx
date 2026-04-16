import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";
import { useState } from "react";
import { AxiosError } from "axios";

/* ---------- TYPES ---------- */

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    token: string;
  };
}

interface UserProfile {
  user_id: number;
  username: string;
  email: string;
}

/* ---------- COMPONENT ---------- */

function Login() {

  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string>("");

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().required("Password required"),
  });

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {

      try {

        setApiError("");

        const loginRes = await api.post<LoginResponse>(
          API_ENDPOINTS.LOGIN,
          values
        );

        const token = loginRes.data.data.token;

        localStorage.setItem("token", token);

        const meRes = await api.get<{ data: UserProfile }>(
          API_ENDPOINTS.PROFILE
        );

        localStorage.setItem(
          "user",
          JSON.stringify(meRes.data.data)
        );

        navigate("/dashboard");

      } catch (error) {

        const err = error as AxiosError<any>;

        setApiError(
          err.response?.data?.message || "Login failed"
        );

      } finally {

        setSubmitting(false);

      }

    },
  });

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">

        <h1
          className="hey"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <img
            src="src\assests\dashboard\social-media.png"
            style={{ width: "70px", height: "70px" }}
          />
          Welcome Back 👋
        </h1>

        <p>
          Log in to continue sharing your moments and connecting
          with your community.
        </p>

        <div className="image-group">

          <img
            src="https://plus.unsplash.com/premium_vector-1740130492063-e9474d6d2c86?q=80&w=551&auto=format&fit=crop"
            alt="login visual 1"
            className="login-image"
          />

          <img
            src="https://plus.unsplash.com/premium_vector-1724612296684-1ebc06e4f0bf?q=80&w=580&auto=format&fit=crop"
            alt="login visual 2"
            className="login-image"
          />

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-container">

          <form
            onSubmit={formik.handleSubmit}
            className="login-form"
          >

            <h2>Login</h2>

            <input
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />

            {apiError && (
              <div className="api-error">
                {apiError}
              </div>
            )}

            <button type="submit">

              {formik.isSubmitting
                ? "Logging in..."
                : "Login"}

            </button>

            <p>
              Don’t have an account?{" "}
              <Link to="/register">Register</Link>
            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;