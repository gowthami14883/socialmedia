import type { NavigateFunction } from "react-router-dom";
interface User {
  user_id: number
  username?: string
}

interface ChatHeaderProps {
  selectedUser: User | null
  navigate: NavigateFunction
}

function ChatHeader({ selectedUser, navigate }: ChatHeaderProps) {
  const capitalizeFirst = (text?: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : ""

  return (
    <div className="ig-header">
      {selectedUser ? (
        <div
          onClick={() =>
            navigate(`/dashboard/profile/${selectedUser.user_id}`)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <img
            src={`https://i.pravatar.cc/150?img=${selectedUser.user_id % 70}`}
            alt="dp"
          />

          <span>
            {capitalizeFirst(selectedUser.username)}
          </span>
        </div>
      ) : (
        <span>Select a conversation</span>
      )}
    </div>
  )
}

export default ChatHeader