import { useState } from "react";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";

interface Message {
  chat_id: number;
  sender_id: number;
  message: string;
}

interface Props {
  msg: Message;
  loggedInUserId: number | null;
  refreshChats: () => void;
}

function MessageItem({ msg, loggedInUserId, refreshChats }: Props) {
  const isSender = msg?.sender_id === loggedInUserId;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(msg?.message);

  const handleDelete = async () => {
    try {
      await api.delete(`${API_ENDPOINTS.CHATS}/${msg?.chat_id}`);
      setMenuOpen(false);
      refreshChats();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditSave = async () => {
    if (!editText.trim()) {
      setIsEditing(false);
      return;
    }

    try {
      await api.put(`${API_ENDPOINTS.CHATS}/${msg?.chat_id}`, {
        message: editText,
      });

      setIsEditing(false);
      refreshChats();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="ig-message-wrapper">
      <div
        className={`ig-message ${
          isSender ? "ig-sent" : "ig-received"
        }`}
        onClick={() => {
          if (isSender && !isEditing) {
            setMenuOpen(!menuOpen);
          }
        }}
      >
        {isEditing ? (
          <input
            className="ig-edit-inline"
            value={editText}
            autoFocus
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
        ) : (
          msg?.message
        )}
      </div>

      {menuOpen && isSender && !isEditing && (
        <div className="ig-msg-menu">
          <button
            onClick={() => {
              setIsEditing(true);
              setMenuOpen(false);
            }}
          >
            Edit
          </button>

          <button
            className="danger"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default MessageItem;