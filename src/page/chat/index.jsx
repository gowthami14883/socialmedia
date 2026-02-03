import { useEffect, useState } from "react";
import api from "../../api/axios";
import "./chat.css";

function Chat() {
  // TEMP: receiver user id (later you can make this dynamic)
  const receiverId = 3; // example: chatting with user id 3

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch chats
  const fetchChats = async () => {
    try {
      const res = await api.get(`/api/chats/${receiverId}`);
      setMessages(res.data.data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      await api.post(`/api/chats/${receiverId}`, {
        message: newMessage
      });

      setNewMessage("");
      fetchChats(); // refresh chat
    } catch (error) {
      console.error("Send message failed", error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h3>Chat</h3>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.chat_id} className="chat-message sent">
              {msg.message}
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
