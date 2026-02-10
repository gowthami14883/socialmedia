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
        <h2 className="insta-logo">Instagram </h2>
        <button onClick={() => setCurrentView("feed")}>🏠 Feed</button>
        <button onClick={() => setCurrentView("profile")}>👤 Profile</button>
        <button onClick={() => setCurrentView("chat")}>💬 Chat</button>
        <button onClick={() => setActivePopup("posts")}>➕ Posts</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
          <div className="popup-box">
           
            <button className="close-btn-top" onClick={() => setActivePopup(null)}>✖</button>
            <h1 style={{textAlign:"center", color:"brown",fontFamily:"sans-serif"}}>create post</h1><br></br>
           
            <form onSubmit={handlePostSubmit}>
              <input type="file" accept="image/*" onChange={handleFileChange} /><br></br><br></br>
              <input
                type="text"
                placeholder="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />&nbsp;&nbsp;&nbsp;
              <button style={{background: "#007bff"}} type="submit">{uploading ? "Uploading..." : "Post"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
