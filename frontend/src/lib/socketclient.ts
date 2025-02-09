// hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (url:string) => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    // Ensure this code runs only on the client-side (browser)
    if (typeof window !== "undefined") {
      const socketInstance = io(url, { transports: ["websocket"] });
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect(); // Clean up on component unmount
      };
    }
  }, [url]);

  return socket;
};

export default useSocket;
