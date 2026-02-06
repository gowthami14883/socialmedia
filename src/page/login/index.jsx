import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string().required("Password required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiError("");

        // 🔹 1. LOGIN
        const loginRes = await api.post(API_ENDPOINTS.LOGIN, values);

        const token = loginRes.data.data.token;

        // 🔹 2. SAVE TOKEN
        localStorage.setItem("token", token);

        // 🔹 3. FETCH LOGGED-IN USER USING TOKEN
        const meRes = await api.get("/api/users/me");

        // 🔹 4. SAVE USER OBJECT
        localStorage.setItem(
          "user",
          JSON.stringify(meRes.data.data)
        );

        // 🔹 5. GO TO DASHBOARD
        navigate("/dashboard");
      } catch (error) {
        setApiError(
          error.response?.data?.message || "Login failed"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <form onSubmit={formik.handleSubmit} className="login-form">
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

        {apiError && <div className="api-error">{apiError}</div>}

        <button type="submit">
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
