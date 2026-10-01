import { io } from "socket.io-client";

export const createSocketConnection = () => {
  const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
  return io(socketUrl, { withCredentials: true });
};
