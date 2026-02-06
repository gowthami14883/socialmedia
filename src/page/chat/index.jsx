import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import "./chat.css";

function Chat() {
  // ✅ 100% SAFE localStorage read
  const storedUser = localStorage.getItem("user");

  let parsedUser = null;
  try {
    parsedUser =
      storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
  } catch (err) {
    console.error("Invalid user in localStorage", err);
    parsedUser = null;
  }

  const loggedInUserId = parsedUser?.user_id ?? null;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // 🚫 Block chat if not logged in
  if (!loggedInUserId) {
    return (
      <div className="ig-chat-wrapper">
        <div className="ig-empty">
          Please login to access chats
        </div>
      </div>
    );
  }

  // -------- FETCH USERS --------
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");

      setUsers(
        (res.data?.data || []).filter(
          (u) => u.user_id !== loggedInUserId
        )
      );
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // -------- FETCH CHATS --------
  const fetchChats = async (userId) => {
    try {
      const res = await api.get(`/api/chats/${userId}`);
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  };

  // -------- SEND MESSAGE --------
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await api.post(`/api/chats/${selectedUser.user_id}`, {
        message: newMessage,
      });

      setNewMessage("");
      fetchChats(selectedUser.user_id);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // -------- AUTO SCROLL --------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="ig-chat-wrapper">
      {/* LEFT USERS */}
      <div className="ig-users">
        <h3>Messages</h3>

        {users.map((user) => (
          <div
            key={user.user_id}
            className={`ig-user ${
              selectedUser?.user_id === user.user_id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              fetchChats(user.user_id);
            }}
          >
            <img src="/default-avatar.png" alt="dp" />
            <span>{user.username}</span>
          </div>
        ))}
      </div>

      {/* RIGHT CHAT */}
      <div className="ig-chat">
        {!selectedUser ? (
          <div className="ig-empty">Select a chat</div>
        ) : (
          <>
            <div className="ig-header">
              <img src="/default-avatar.png" alt="dp" />
              <span>{selectedUser.username}</span>
            </div>

            <div className="ig-messages">
              {messages.map((msg) => (
                <div
                  key={msg.chat_id}
                  className={`ig-message ${
                    msg.sender_id === loggedInUserId
                      ? "ig-sent"
                      : "ig-received"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="ig-input">
              <input
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
