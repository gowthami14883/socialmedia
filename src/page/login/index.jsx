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

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('onSubmit ',values)
      try {
        setApiError("");
        console.log('API_ENDPOINTS.LOGIN ',API_ENDPOINTS.LOGIN)
        const response = await api.post(API_ENDPOINTS.LOGIN, values);
        console.log('response ',response)

        // Store token
        localStorage.setItem("token", response.data.data.token);

        navigate("/dashboard");
      } catch (error) {
        setApiError(
          error.response?.data?.message || "Invalid email or password"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={formik.handleSubmit}>
        <h2>Login</h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <span className="error">{formik.errors.email}</span>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password && (
          <span className="error">{formik.errors.password}</span>
        )}

        {/* API Error */}
        {apiError && <div className="api-error">{apiError}</div>}

        <button type="submit" disabled={formik.isSubmitting}>
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
