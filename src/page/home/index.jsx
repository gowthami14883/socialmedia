import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Uncomment if you want auto redirect
    // if (token) {
    //   navigate("/dashboard");
    // }
  }, [navigate]);

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}><img src="src\assests\dashboard\logo.png" style={{ width: "70px", height: "70px" }} ></img>LifeinFrames</h2>
        <div className="nav-links">
          <Link to="/login" className="nav-btn login-btn">Login</Link>
          <Link to="/register" className="nav-btn register-btn">Register</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-left">
          <h1>
            Share Your <span>Moments</span> With The World 📸
          </h1>
          <p>
            Connect with friends, share photos and videos,
            and explore amazing content just like Instagram.
          </p>

          <Link to="/register" className="hero-button">
            Get Started
          </Link>
        </div>

        <div className="hero-right">
          <div className="phone-mockup">
            <div className="post">
              <div className="post-header">
                <div className="avatar"></div>
                <span>Gowthami.dev</span>
              </div>

              <img
                src="https://plus.unsplash.com/premium_photo-1681883455364-b8fc8c56b967?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="post"
              />

              <div className="post-actions">
                ❤️ 💬 🔁
              </div>

              <p className="caption">
                <strong>Gowthami.dev</strong> Building my own Instagram Clone 🚀
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;
