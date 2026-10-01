import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!targetUserId) return;

    const fetchChat = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });
        setMessages(res.data?.messages || []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChat();
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    // FIX: only targetUserId is sent now. The backend identifies *us* from
    // the authenticated socket connection (the cookie, verified in
    // backend/utils/socket.js), not from a client-supplied userId/
    // firstName, which could previously be set to anything by the client.
    socket.emit("joinChat", { targetUserId });

    socket.on("messageReceived", (incomingMsg) => {
      setMessages((prev) => [
        ...prev,
        {
          senderId: incomingMsg.senderId,
          firstName: incomingMsg.firstName,
          text: incomingMsg.text,
        },
      ]);
    });

    return () => {
      socket.off("messageReceived");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || !socketRef.current) return;

    // FIX: senderId/firstName are no longer sent — the server derives both
    // from the authenticated socket and would ignore them anyway now, but
    // sending them was misleading (it looked like the client controlled
    // identity, which it no longer does).
    socketRef.current.emit("sendMessage", {
      targetUserId,
      text: trimmedMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col rounded-lg overflow-hidden bg-base-100">
      <h1 className="p-4 border-b border-gray-600 font-semibold text-lg">
        Chat
      </h1>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, idx) => {
          // Resolve sender ID regardless of how the backend sends it (string vs ObjectId)
          const msgSenderId =
            typeof msg.senderId === "object"
              ? msg.senderId?._id
              : msg.senderId || msg.userId;

          // Determine if the current logged-in user sent this message
          const isSender =
            msgSenderId &&
            userId &&
            msgSenderId.toString() === userId.toString();

          // Safely extract the first name for both sender and receiver
          const displayFirstName = isSender
            ? user?.firstName
            : msg.firstName || msg.senderId?.firstName || "User";

          return (
            <div
              key={msg._id || idx}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              {/* Display the First Name on top of the bubble */}
              <div className="chat-header text-xs opacity-70 mb-1">
                {displayFirstName}
              </div>

              <div
                className={`chat-bubble ${
                  isSender
                    ? "chat-bubble-primary text-white"
                    : "chat-bubble-neutral text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-600 flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-600 bg-transparent text-white rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          placeholder="Type a message..."
        />

        <button type="submit" className="btn btn-secondary px-6">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
