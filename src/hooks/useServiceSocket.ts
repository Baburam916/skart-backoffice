import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const hostname = window.location.hostname;
const SOCKET_URL =
  hostname === "localhost"
    ? "http://localhost:8014"
    : hostname === "devbackoffice.skart-express.com"
    ? "https://devapiv2.skart-express.com"
    : "https://apiv2.skart-express.com";

export const useServiceSocket = (
  serviceName: string,
  eventName: string,
  onEvent: (payload: any) => void,
  onReconnect?: () => void
) => {
  const socketRef = useRef<Socket | null>(null);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: `/api/v1/${serviceName}/socket.io`,
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      if (hasConnectedRef.current && onReconnect) {
        onReconnect();
      }
      hasConnectedRef.current = true;
    });

    socket.on(eventName, (payload: any) => {
      onEvent(payload);
    });

    const handleOnline = () => {
      if (onReconnect) onReconnect();
    };
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);
};
