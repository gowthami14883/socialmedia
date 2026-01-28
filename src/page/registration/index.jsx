import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <br /><br />

        <label>Gender:</label>
        <br />
        <input type="radio" name="gender" value="male" onChange={handleChange} /> Male
        <input type="radio" name="gender" value="female" onChange={handleChange} /> Female
        <input type="radio" name="gender" value="other" onChange={handleChange} /> Other

        <br /><br />

        <label>Date of Birth:</label>
        <br />
        <input type="date" name="dob" onChange={handleChange} />

        <br /><br />

        <input
          type="checkbox"
          name="terms"
          onChange={handleChange}
        /> Accept Terms & Conditions

        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
