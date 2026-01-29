import "./Register.css";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="register-container">
      <form className="register-form">
        <h2>Register</h2>

        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <input type="date" />

        <div className="gender-group">
          <label>
            <input type="radio" name="gender" value="male" /> Male
          </label>
          <label>
            <input type="radio" name="gender" value="female" />Female
          </label>
          <label>
            <input type="radio" name="gender" value="other" />Other
          </label>
        </div>


        <div className="terms">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">I agree to Terms & Conditions</label>
        </div>

        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
