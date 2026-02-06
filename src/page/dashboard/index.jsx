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

  // 🔥 Controls dashboard content
  const [currentView, setCurrentView] = useState("feed");

  // 🔥 Popup ONLY for posts
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
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!mediaFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("media", mediaFile);
    formData.append("caption", caption);

    try {
      setUploading(true);
      await api.post(API_ENDPOINTS.POSTS, formData);
      alert("Post uploaded!");
      setCaption("");
      setMediaFile(null);
      setActivePopup(null);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="insta-layout">
      {/* LEFT SIDEBAR */}
      <div className="insta-sidebar">
        <h2 className="insta-logo">Instagram</h2>

        {/* DASHBOARD VIEWS */}
        <button onClick={() => setCurrentView("feed")}>🏠 Feed</button>
        <button onClick={() => setCurrentView("profile")}>👤 Profile</button>
        <button onClick={() => setCurrentView("chat")}>💬 Chat</button>

        {/* POPUP ACTION */}
        <button onClick={() => setActivePopup("posts")}>➕ Posts</button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* RIGHT CONTENT — FEED / PROFILE / CHAT */}
      <div className="insta-content">
        {currentView === "feed" && <Feed />}
        {currentView === "profile" && <Profile />}
        {currentView === "chat" && <Chat />}
      </div>

      {/* POPUP — ONLY POSTS */}
      {activePopup === "posts" && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button
              className="close-btn-top"
              onClick={() => setActivePopup(null)}
            >
              ✖
            </button>

            <div className="posts-popup">
              <h3>Upload Post</h3>

              <form onSubmit={handlePostSubmit}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <input
                  type="text"
                  placeholder="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />

                <div className="posts-btns">
                  <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Post"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePopup(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {mediaFile && (
                <img
                  src={URL.createObjectURL(mediaFile)}
                  alt="preview"
                  className="preview-img"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
