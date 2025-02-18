import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCK_JS_CALL_CENTER_URL, {
        transports: [import.meta.env.VITE_SOCK_JS_TRANSPORT_PROTOCOL],
      reconnectionAttempts: 5, 
      reconnectionDelay: 2000, 
    });

    socketInstance.on('connect', () => {
      console.log(" Connected:", socketInstance.id);

       
      console.log(" Sent register event:", { source: "front", clientId: socketInstance.id });
    });

    

    socketInstance.on('disconnect', () => {
      console.log(" Disconnected:", socketInstance.id);
    });

    socketInstance.on('connect_error', (error) => {
      console.error(" WebSocket Connection Error:", error);
    });

    setSocket(socketInstance);

    return () => {
      console.log(" Cleaning up WebSocket connection...");
      socketInstance.disconnect();
    };
  }, [dispatch]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
