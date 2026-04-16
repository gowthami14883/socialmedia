import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import FeedView from "./FeedView";
import PostPopup from "./PostPopup";
import Profile from "../profile";
import Chat from "../chat";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentView, setCurrentView] = useState<string>("feed");
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  // SYNC URL
  useEffect(() => {
    if (location.pathname.includes("/dashboard/profile"))
      setCurrentView("profile");
    else if (location.pathname.includes("/dashboard/chat"))
      setCurrentView("chat");
    else setCurrentView("feed");
  }, [location.pathname]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setMediaFiles(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!caption.trim() && !mediaFiles.length) {
      alert("Post must contain caption or media");
      return;
    }

    const formData = new FormData();

    if (mediaFiles.length > 0) {
      mediaFiles.forEach((file) => formData.append("media", file));
    }

    if (caption.trim()) {
      formData.append("caption", caption);
    }

    try {
      setUploading(true);

      await api.post(API_ENDPOINTS.POSTS, formData);

      setCaption("");
      setMediaFiles([]);
      setPreview([]);
      setActivePopup(null);

    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="insta-layout">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        navigate={navigate}
        setActivePopup={setActivePopup}
      />

      <div className="insta-content">
        {currentView === "feed" && <FeedView />}
        {currentView === "profile" && <Profile />}
        {currentView === "chat" && <Chat />}
      </div>

      <PostPopup
        active={activePopup === "posts"}
        setActivePopup={setActivePopup}
        mediaFiles={mediaFiles}
        setMediaFiles={setMediaFiles}
        preview={preview}
        setPreview={setPreview}
        caption={caption}
        setCaption={setCaption}
        uploading={uploading}
        handleFileChange={handleFileChange}
        handlePostSubmit={handlePostSubmit}
      />
    </div>
  );
}

export default Dashboard;