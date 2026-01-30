import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (token) {
    //   navigate("/dashboard"); // redirect if already logged in
    // }
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>DASHBOARD</h1>
      <p>YOU ARE SUCCESSFULLY LOGGED IN</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/profile" style={{ marginRight: "15px", background: "orange" }}>
          Profile
        </Link>
        <Link to="/chat" style={{ marginRight: "15px", background: "lightpink" }}>
          chat
        </Link>
        <Link to="/allposts" style={{ marginRight: "15px", background: "lightpink" }}>
          allposts
        </Link>
      </div>
      <br></br>
      <button type ="submit" style={{background: "blue"}}>logout</button>
    </div>
  );
}

export default Dashboard;
