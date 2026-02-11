import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Profile from "../profile";
import Chat from "../chat";
import Feed from "../../components/feed";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("feed");
  const [activePopup, setActivePopup] = useState(null);
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFile) return alert("Select file");

    const formData = new FormData();
    formData.append("media", mediaFile);
    formData.append("caption", caption);

    try {
      setUploading(true);
      await api.post(API_ENDPOINTS.POSTS, formData);
      setCaption("");
      setMediaFile(null);
      setActivePopup(null);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="insta-layout">
      {/* SIDEBAR */}
      <div className="insta-sidebar">
        <h2 className="insta-logo" style={{display: "flex",alignItems: "center",gap: "10px"}}><img src="src\assests\dashboard\logo.png" style={{width:"70px",height:"70px"}} ></img>LifeinFrames </h2>
        <button onClick={() => setCurrentView("feed")}>🏠 Feed</button>
        <button onClick={() => setCurrentView("profile")}>👤 Profile</button>
        <button onClick={() => setCurrentView("chat")}>💬 Chat</button>
        <button onClick={() => setActivePopup("posts")}>➕ Posts</button>
        <button style={{background:"darkred"}}className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* CONTENT */}
      <div className="insta-content">
        {currentView === "feed" && (
          <div className="feed-layout">

            {/* FEED */}
            <div className="scroll-view feed-center">
              <Feed />
            </div>

            {/* RIGHT ADS + AUTO SCROLL */}
            <div className="visual-panel">
              <div className="auto-scroll">

                {/* repeating images for smooth loop */}
                {[
                  47, 32, 15, 5, 68, 21, 9, 44, 18, 60,
                  47, 32, 15, 5, 68, 21, 9, 44, 18, 60
                ].map((img, i) => (
                  <div className="ad-card" key={i}>
                    <span className="ad-badge">Sponsored</span>
                    <img
                      src={`https://i.pravatar.cc/300?img=${img}`}
                      className="ad-media"
                      alt="ad"
                    />
                    <div className="ad-text">
                      <h4>Discover Beauty ✨</h4>
                      <p>Trending creators today</p>
                      <button>Follow</button>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}

        {currentView === "profile" && <Profile />}
        {currentView === "chat" && <Chat />}
      </div>

      {/* POST POPUP */}
      {activePopup === "posts" && (
  <div className="popup-overlay">
    <div className="popup-box-modern">

      {/* HEADER */}
      <div className="popup-header">
        <h3 style={{textAlign:"center"}}>Create post</h3>
        <button onClick={() => setActivePopup(null)}>✖</button>
      </div>

      {/* BODY */}
      <form onSubmit={handlePostSubmit} className="popup-body">

        {/* Caption */}
        <textarea
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Submit */}
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Post"}
        </button>

      </form>

    </div>
  </div>
)}

    </div>
  );
}

export default Dashboard;
