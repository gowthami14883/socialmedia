import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import "./chat.css";

function Chat() {
  const storedUser = localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser =
      storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
  } catch {
    parsedUser = null;
  }

  const loggedInUserId = parsedUser?.user_id ?? null;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [menuMsgId, setMenuMsgId] = useState(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const messagesRef = useRef(null);

  if (!loggedInUserId) {
    return (
      <div className="ig-chat-wrapper">
        <div className="ig-empty">Please login to access chats</div>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/api/users");
    setUsers(
      (res.data?.data || []).filter(
        (u) => u.user_id !== loggedInUserId
      )
    );
  };

  const fetchChats = async (userId) => {
    const res = await api.get(`/api/chats/${userId}`);
    setMessages(res.data?.data || []);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    await api.post(`/api/chats/${selectedUser.user_id}`, {
      message: newMessage,
    });

    setNewMessage("");
    fetchChats(selectedUser.user_id);
  };

  const handleDelete = async (messageId) => {
    await api.delete(`/api/chats/${messageId}`);
    setMenuMsgId(null);
    fetchChats(selectedUser.user_id);
  };

  const handleEditSave = async (messageId) => {
    if (!editingText.trim()) {
      setEditingMsgId(null);
      return;
    }

    await api.put(`/api/chats/${messageId}`, {
      message: editingText,
    });

    setEditingMsgId(null);
    setEditingText("");
    fetchChats(selectedUser.user_id);
  };

  const handleEditKey = (e, msgId) => {
    if (e.key === "Enter") handleEditSave(msgId);
    if (e.key === "Escape") {
      setEditingMsgId(null);
      setEditingText("");
    }
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const capitalizeFirst = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
  };


  return (
    <div className="ig-chat-wrapper">
      {/* USERS LIST */}
      <div className="ig-users">
        <h3 className="ig-users-title">Messages</h3>

        {users.map((user) => (
          <div
            key={user.user_id}
            className={`ig-user-card ${
              selectedUser?.user_id === user.user_id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              fetchChats(user.user_id);
            }}
          >
            <img
              src={`https://i.pravatar.cc/150?img=${user.user_id % 70}`}
              alt="dp"
            />
            <div>
              <strong>{capitalizeFirst(user.username)}</strong>
              <p>Tap to chat</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="ig-chat">
        {/* HEADER */}
        <div className="ig-header">
          {selectedUser ? (
            <>
              <img
                src={`https://i.pravatar.cc/150?img=${selectedUser.user_id % 70}`}
                alt="dp"
              />
              <span>{capitalizeFirst(selectedUser.username)}</span>
            </>
          ) : (
            <span>Select a conversation</span>
          )}
        </div>

        {/* MESSAGES */}
        <div className="ig-messages" ref={messagesRef}>
          {!selectedUser ? (
            <div className="ig-empty">
              Select a chat to start messaging
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.chat_id} className="ig-message-wrapper">
                <div
                  className={`ig-message ${
                    msg.sender_id === loggedInUserId
                      ? "ig-sent"
                      : "ig-received"
                  }`}
                  onClick={() => {
                    if (
                      msg.sender_id === loggedInUserId &&
                      editingMsgId !== msg.chat_id
                    ) {
                      setMenuMsgId(
                        menuMsgId === msg.chat_id
                          ? null
                          : msg.chat_id
                      );
                    }
                  }}
                >
                  {editingMsgId === msg.chat_id ? (
                    <input
                      className="ig-edit-inline"
                      value={editingText}
                      autoFocus
                      onChange={(e) =>
                        setEditingText(e.target.value)
                      }
                      onKeyDown={(e) =>
                        handleEditKey(e, msg.chat_id)
                      }
                      onBlur={() =>
                        handleEditSave(msg.chat_id)
                      }
                    />
                  ) : (
                    msg.message
                  )}
                </div>

                {menuMsgId === msg.chat_id &&
                  msg.sender_id === loggedInUserId && (
                    <div className="ig-msg-menu">
                      <button
                        onClick={() => {
                          setEditingMsgId(msg.chat_id);
                          setEditingText(msg.message);
                          setMenuMsgId(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="danger"
                        onClick={() =>
                          handleDelete(msg.chat_id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        {selectedUser && (
          <div className="ig-input">
            <input
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
            />
            <button onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
