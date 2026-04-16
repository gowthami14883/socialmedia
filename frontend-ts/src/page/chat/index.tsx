import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";

import UsersList from "./UsersList";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import ChatInput from "./ChatInput";

import "./chat.css";

interface User {
  user_id: number;
  username?: string;
}

interface Message {
  chat_id: number;
  sender_id: number;
  receiver_id?: number;
  message: string;
  createdAt?: string;
}

function Chat() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const storedUser = localStorage.getItem("user");

  let parsedUser: User | null = null;

  try {
    parsedUser =
      storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
  } catch {
    parsedUser = null;
  }

  const loggedInUserId = parsedUser?.user_id ?? null;

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  // ============================
  // Fetch Users
  // ============================

  const fetchUsers = async (search = "") => {
    try {
      let res;

      if (search.trim() === "") {
        res = await api.get("/api/followers/chat-users");
      } else {
        res = await api.get("/api/users/search", {
          params: { username: search },
        });
      }

      const usersList: User[] = res.data?.data || [];

      setUsers(
        usersList.filter((u) => u?.user_id !== loggedInUserId)
      );
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ============================
  // Fetch Chats
  // ============================

  const fetchChats = async (userId: number, pageNumber = 1) => {
    try {
      const res = await api.get(
        `${API_ENDPOINTS.CHATS}/${userId}`,
        {
          params: {
            page: pageNumber,
            limit: limit,
          },
        }
      );

      const responseData = res?.data?.data;

      const chats: Message[] =
        responseData?.chats?.reverse() || [];

      if (pageNumber === 1) {
        setMessages(chats);
      } else {
        setMessages((prev) => [...chats, ...prev]);
      }

      setHasMore(pageNumber < responseData?.totalPages);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  // ============================
  // Send Message
  // ============================

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const res = await api.post(
        `${API_ENDPOINTS.CHATS}/${selectedUser?.user_id}`,
        { message: newMessage }
      );

      const newMsgFromServer: Message = res?.data?.data;

      setMessages((prev) => [...prev, newMsgFromServer]);

      setNewMessage("");

      setTimeout(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop =
            messagesRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ============================
  // Effects
  // ============================

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(searchText);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchText]);

  useEffect(() => {
    if (userId && users?.length > 0) {
      const foundUser = users?.find(
        (u) => String(u?.user_id) === String(userId)
      );

      if (foundUser) {
        setSelectedUser(foundUser);
        setPage(1);
        fetchChats(foundUser?.user_id, 1);
      }
    }
  }, [userId, users]);

  useEffect(() => {
    const container = messagesRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop <= 5 && hasMore && selectedUser) {
        const nextPage = page + 1;

        setPage(nextPage);

        fetchChats(selectedUser.user_id, nextPage);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () =>
      container.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, selectedUser]);

  useEffect(() => {
    if (page === 1 && messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // ============================
  // Render
  // ============================

  if (!loggedInUserId) {
    return (
      <div className="ig-chat-wrapper">
        <div className="ig-empty">
          Please login to access chats
        </div>
      </div>
    );
  }

  return (
    <div className="ig-chat-wrapper">
      <UsersList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={(user: User) => {
          setSelectedUser(user);
          setPage(1);
          fetchChats(user?.user_id, 1);
        }}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <div className="ig-chat">
        <ChatHeader
          selectedUser={selectedUser}
          navigate={navigate}
        />

        <div className="ig-messages" ref={messagesRef}>
          {selectedUser ? (
            <MessagesList
              messages={messages}
              loggedInUserId={loggedInUserId}
              refreshChats={() =>
                fetchChats(selectedUser?.user_id)
              }
            />
          ) : (
            <div className="ig-empty">
              Select a chat to start messaging
            </div>
          )}
        </div>

        {selectedUser && (
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSend={handleSend}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;