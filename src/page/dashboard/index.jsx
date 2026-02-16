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
  const [mediaFiles, setMediaFiles] = useState([]);
  const [preview, setPreview] = useState([]);
 // ✅ already present
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

  // ✅ UPDATED FILE CHANGE FUNCTION
  const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  setMediaFiles(files);

  const previewUrls = files.map((file) =>
    URL.createObjectURL(file)
  );

  setPreview(previewUrls);
};


  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFiles.length) return alert("Select file");


    const formData = new FormData();
    mediaFiles.forEach((file) => 
      {
       formData.append("media", file);
      });

    formData.append("caption", caption);

    try {
      setUploading(true);
      await api.post(API_ENDPOINTS.POSTS, formData);

      setCaption("");
      setMediaFiles([]);
      setPreview([]);
 // ✅ clear preview
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
        <h2
          className="insta-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#8134af",
          }}
        >
          <img
            src="src\assests\dashboard\logo.png"
            style={{ width: "70px", height: "70px" }}
          />
          LifeinFrames
        </h2>

        <div className="sidebar-link" onClick={() => setCurrentView("feed")}>
          🏠 Feed
        </div>
        <div className="sidebar-link" onClick={() => setCurrentView("profile")}>
          👤 Profile
        </div>
        <div className="sidebar-link" onClick={() => setCurrentView("chat")}>
          💬 Chat
        </div>
        <div className="sidebar-link" onClick={() => {
          setMediaFiles([]);
          setPreview([]);
          setCaption("");
          setActivePopup("posts");
          }}>➕ Posts
        </div>


        <div className="sidebar-link logout-link" onClick={handleLogout}>
          Logout
        </div>
      </div>

      {/* CONTENT */}
      <div className="insta-content">
        {currentView === "feed" && (
          <div className="feed-layout">
            <div className="scroll-view feed-center">
              <Feed />
            </div>

            <div className="visual-panel">
              <div className="auto-scroll">
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
            <div className="popup-header">
              <h3 style={{ textAlign: "center" }}>Create post</h3>
              <button onClick={() => {
                setActivePopup(null);
                setMediaFiles([]);
                setPreview([]);
                setCaption("");
                }}> ✖
              </button>


            </div>

            <form onSubmit={handlePostSubmit} className="popup-body">
              <textarea
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />

              <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              />


              {/* ✅ PREVIEW SECTION */}
              {preview.length > 0 && (
                <div className="preview-container-multiple">
                  {preview.map((src, index) => (
                    <img key={index} src={src}
                     alt="preview"
                      className="preview-image-multiple"
                    />
                    ))
                  }
                </div>
              )}


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
