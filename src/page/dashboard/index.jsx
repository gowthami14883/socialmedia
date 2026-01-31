import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="insta-layout">
      {/* LEFT SIDEBAR */}
      <div className="insta-sidebar">
        <h2 className="insta-logo">Instagram</h2>

        <button><Link to="/profile" className="insta-link">
          👤 <span>Profile</span>
        </Link></button><br></br>

        <button><Link to="/posts" className="insta-link">
          🏠 <span>Posts</span>
        </Link></button><br></br>

        <button><Link to="/chat" className="insta-link">
          💬 <span>Chat</span>
        </Link></button><br></br>

        <button className="logout-btn"onClick={handleLogout}>
           Logout
        </button>

      </div>

      {/* RIGHT CONTENT */}
      <div className="insta-content">
        <h1><b>Dashboard</b></h1>
        <img src="src\assests\dashboard\visaka.png"></img>
        <img src="src/assests/dashboard/atumlife.jpg"></img>
        <div style={{gap:"5px"}}></div>
        <img src="src/assests/dashboard/atumobile.jpg"></img>
        <img src="src/assests/dashboard/insta.jpg"></img>
        <div style={{gap:"5px"}}></div>
 
      </div>
    </div>
  );
}

export default Dashboard;
