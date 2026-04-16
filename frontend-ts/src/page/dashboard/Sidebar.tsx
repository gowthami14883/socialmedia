import { FaHome, FaUser, FaCommentDots, FaPlusSquare, FaSignOutAlt } from "react-icons/fa";
import SidebarLink from "./SidebarLink";
import logo from "../../assests/dashboard/social-media.png";
import type { NavigateFunction } from "react-router-dom";
interface SidebarProps {
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  navigate: NavigateFunction;
  setActivePopup: React.Dispatch<React.SetStateAction<string | null>>;
}

function Sidebar({
  currentView,
  setCurrentView,
  navigate,
  setActivePopup,
}: SidebarProps) {

  const goToFeed = () => {
    setCurrentView("feed");
    navigate("/dashboard");
  };

  const goToProfile = () => {
    setCurrentView("profile");
    navigate("/dashboard/profile");
  };

  const goToChat = () => {
    setCurrentView("chat");
    navigate("/dashboard/chat");
  };

  const handleLogout = () => {
    alert("Logged out successfully");
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="insta-sidebar">
      <h2 className="insta-logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo} style={{ width: "70px", height: "70px" }} />
        V-Connect
      </h2>

      <SidebarLink icon={<FaHome />} text="Feed" active={currentView === "feed"} onClick={goToFeed} />
      <SidebarLink icon={<FaUser />} text="Profile" onClick={goToProfile} />
      <SidebarLink icon={<FaCommentDots />} text="Chat" active={currentView === "chat"} onClick={goToChat} />
      <SidebarLink icon={<FaPlusSquare />} text="Posts" onClick={() => setActivePopup("posts")} />
      <SidebarLink icon={<FaSignOutAlt />} text="Logout" onClick={handleLogout} className="logout-link" />
    </div>
  );
}

export default Sidebar;