import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const hostname = window.location.hostname;
const SOCKET_URL =
  hostname === "localhost"
    ? "http://localhost:8014"
    : hostname === "devbackoffice.skart-express.com"
    ? "https://devapiv2.skart-express.com"
    : "https://apiv2.skart-express.com";



export const useBookingSocket = (
  onBookingStatusChanged: any
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: "/api/v1/booking/socket.io",
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    socket.on("booking_status_changed", (payload: any) => {
      onBookingStatusChanged(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);
};
