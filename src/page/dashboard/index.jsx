import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Profile from "../profile";
import Chat from "../chat";
import Feed from "../../components/feed";
import api from "../../api/axios";
import { API_ENDPOINTS, API_BASE_URL } from "../../api/config";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null); 
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!mediaFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("media", mediaFile);
    formData.append("caption", caption);

    try {
      setUploading(true);
      await api.post(API_ENDPOINTS.POSTS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Post uploaded successfully!");
      setCaption("");
      setMediaFile(null);
      setActivePopup(null); // close popup after posting
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload post");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    // reset caption and file
    setCaption("");
    setMediaFile(null);
  };

  return (
    <div className="insta-layout">
      {/* LEFT SIDEBAR */}
      <div className="insta-sidebar">
        <h2 className="insta-logo">Instagram</h2>

        <button onClick={() => setActivePopup("profile")}>👤 Profile</button>
        <button onClick={() => setActivePopup("feed")}>🏠 Feed</button>
        <button onClick={() => setActivePopup("posts")}>🏠 Posts</button>
        <button onClick={() => setActivePopup("chat")}>💬 Chat</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* RIGHT CONTENT */}
      <div className="insta-content">
        <h1><b>Dashboard</b></h1>
        <img src="src/assests/dashboard/visaka.png" />
        <img src="src/assests/dashboard/atumlife.jpg" />
        <img src="src/assests/dashboard/atumobile.jpg" />
        <img src="src/assests/dashboard/insta.jpg" />
      </div>

      {/* POPUP MODAL */}
      {activePopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {/* Small cross to close popup */}
            <button className="close-btn-top" onClick={() => setActivePopup(null)}>✖</button>

            {activePopup === "profile" && <Profile />}
            {activePopup === "feed" && <Feed />}
            {activePopup === "chat" && <Chat />}

            {/* POSTS FORM */}
            {activePopup === "posts" && (
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
                    <button type="button" onClick={handleCancel}>Cancel</button>
                  </div>
                </form>

                {mediaFile && (
                  <div className="preview">
                    <p>Preview:</p>
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="preview"
                      className="preview-img"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
