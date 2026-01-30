import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  // Yup validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),

    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),

    dob: Yup.date().required("Date of birth is required"),

    gender: Yup.string().required("Gender is required"),

    terms: Yup.boolean()
      .oneOf([true], "You must accept the terms & conditions"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      dob: "",
      gender: "",
      terms: false,
    },
    validationSchema,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        setApiError("");

        const payload = {
          username: values.username,
          email: values.email,
          password: values.password,
          dateofbirth: values.dob,
          gender: values.gender,
        };

        await api.post(API_ENDPOINTS.REGISTER, payload);

        navigate("/login");
      } catch (error) {
        const backendErrors = error.response?.data?.data;

        if (Array.isArray(backendErrors)) {
          backendErrors.forEach((err) => {
            if (err.path && err.msg) {
              setFieldError(err.path, err.msg);

              // ✅ POPUP alert for already registered errors
              if (err.msg.toLowerCase().includes("already registered")) {
                alert(err.msg);
              }
            }
          });
        } else {
          setApiError("Registration failed");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={formik.handleSubmit}>
        <h2>Register</h2>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username && (
          <span className="error">{formik.errors.username}</span>
        )}

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

        {/* Date of Birth */}
        <input
          type="date"
          name="dob"
          value={formik.values.dob}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.dob && formik.errors.dob && (
          <span className="error">{formik.errors.dob}</span>
        )}

        {/* Gender */}
        <div className="gender-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formik.values.gender === "male"}
              onChange={formik.handleChange}
            />
            Male
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formik.values.gender === "female"}
              onChange={formik.handleChange}
            />
            Female
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formik.values.gender === "other"}
              onChange={formik.handleChange}
            />
            Other
          </label>
        </div>
        {formik.touched.gender && formik.errors.gender && (
          <span className="error">{formik.errors.gender}</span>
        )}

        {/* Terms */}
        <div className="terms">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formik.values.terms}
            onChange={formik.handleChange}
          />
          <label htmlFor="terms">I agree to Terms & Conditions</label>
        </div>
        {formik.touched.terms && formik.errors.terms && (
          <span className="error">{formik.errors.terms}</span>
        )}

        {/* API Error */}
        {apiError && <div className="api-error">{apiError}</div>}

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
