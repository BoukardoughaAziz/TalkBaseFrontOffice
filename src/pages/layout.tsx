import { Outlet } from "react-router-dom";
import Sidebar from "./statisticsDashboard/Sidebar";
import { useEffect, useState, useRef } from "react";
import { useConversation } from "@/context/ConversationContext";
import { io, Socket } from "socket.io-client";
import CallState from "@/models/CallState";
import Peer from "simple-peer";
import { Phone, X, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "new-conversation" | "conversation-handled";
  title: string;
  message: string;
  conversationId?: string;
}

export default function Layout() {
  const { connectedAgent, setConnectedAgent, socketid, conversations } = useConversation();

  // ---- Call states ----
  const [callState, setCallState] = useState<CallState>(CallState.Idle);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ from: string; type: "audio" | "video" } | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [stream, setStream] = useState<MediaStream | null>(null);

  // ---- Notification states ----
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // ---- Refs ----
  const socketRefClient = useRef<Socket | null>(null);
  const socketRefAgent = useRef<Socket | null>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);
  const socketidRef = useRef(socketid);

  useEffect(() => {
    socketidRef.current = socketid;
  }, [socketid]);

  // ---- Add notification ----
  const addNotification = (notification: Notification, duration: number = 3000) => {
    const id = notification.id;
    
    // Clear existing timer if any
    if (notificationTimers.current.has(id)) {
      clearTimeout(notificationTimers.current.get(id));
    }

    // Add notification to state
    setNotifications((prev) => [...prev, notification]);

    // Set auto-remove timer
    const timer = setTimeout(() => {
      removeNotification(id);
    }, duration);

    notificationTimers.current.set(id, timer);
  };

  // ---- Remove notification ----
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    
    if (notificationTimers.current.has(id)) {
      clearTimeout(notificationTimers.current.get(id));
      notificationTimers.current.delete(id);
    }
  };

  // ---- Initialize sockets ----
  useEffect(() => {
    console.log("Layout mounted — initializing sockets");

    if (!socketRefClient.current) {
      socketRefClient.current = io(import.meta.env.VITE_SOCK_JS_WIDGET_URL, {
        transports: [import.meta.env.VITE_SOCK_JS_TRANSPORT_PROTOCOL],
      });
    }

    if (!socketRefAgent.current) {
      socketRefAgent.current = io(import.meta.env.VITE_SOCK_JS_CALL_CENTER_URL, {
        transports: [import.meta.env.VITE_SOCK_JS_TRANSPORT_PROTOCOL],
      });
    }

    const socketClient = socketRefClient.current;

    socketClient.on("callUser", (data) => {
      if (data.to === socketidRef.current) {
        console.log("📞 Incoming call for me:", data);

        setIncomingCall({ from: data.from, type: data.calltype || "audio" });
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
        setCallState(CallState.IncomingCall);
        setCallType(data.calltype || "audio");
      }
    });

    socketRefClient.current?.on('AConversationWillBeHandledByAgent', (conversationId) => {
      console.log("No More AI For This Conversation", conversationId);
      
      // Show notification for AI to Agent transfer
      addNotification(
        {
          id: `handled-${conversationId}`,
          type: "conversation-handled",
          title: "Conversation Transferred",
          message: "A conversation has been transferred to a human agent",
          conversationId,
        },
        3000
      );
    });

    socketRefClient.current?.on('ConversationStarted', (NewConversation, AppAgentID) => {
      console.log("*************************************************");
      console.log("A New Conversation Was Added", NewConversation);
      console.log("This is the Agent handling it", AppAgentID);
      console.log("*************************************************");

      // Show notification for new conversation
      addNotification(
        {
          id: `new-conv-${NewConversation._id || NewConversation.id}`,
          type: "new-conversation",
          title: "New Conversation",
          message: "You have a new conversation to handle",
          conversationId: NewConversation._id || NewConversation.id,
        },
        3000
      );
    });

    return () => {
      socketClient?.off("callUser");
      socketClient?.off("AConversationWillBeHandledByAgent");
      socketClient?.off("ConversationStarted");
    };
  }, []);

  // ---- Answer call ----
  const answerCall = async () => {
    try {
      console.log("✅ Answering call...");

      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      setStream(localStream);

      if (myVideo.current) {
        myVideo.current.srcObject = localStream;
        myVideo.current.muted = true;
      }

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: localStream,
      });

      peer.on("signal", (data) => {
        socketRefClient.current?.emit("answercall", {
          signal: data,
          to: caller,
        });
      });

      peer.on("stream", (remoteStream) => {
        console.log("🎥 Received remote stream");
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      if (callerSignal) {
        peer.signal(callerSignal);
      }

      connectionRef.current = peer;
      setCallState(CallState.InCall);
    } catch (error) {
      console.error("❌ Error answering call:", error);
    }
  };

  // ---- End call ----
  const handleEndCall = () => {
    console.log("📴 Ending call");

    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    setCallState(CallState.Idle);
    setCallType(null);
    setIncomingCall(null);
    setReceivingCall(false);
    setCaller("");
  };

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
          {/* 🔔 Notifications Container */}
          <div
            className="notifications-container"
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 9998,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "400px",
            }}
          >
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification notification-${notif.type}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  backgroundColor:
                    notif.type === "new-conversation" ? "#dbeafe" : "#dcfce7",
                  border:
                    notif.type === "new-conversation"
                      ? "1px solid #0284c7"
                      : "1px solid #16a34a",
                  animation: "slideIn 0.3s ease-out",
                }}
              >
                <Bell
                  size={20}
                  style={{
                    color:
                      notif.type === "new-conversation" ? "#0284c7" : "#16a34a",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontWeight: "600",
                      color:
                        notif.type === "new-conversation"
                          ? "#0c4a6e"
                          : "#15803d",
                      fontSize: "14px",
                    }}
                  >
                    {notif.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color:
                        notif.type === "new-conversation"
                          ? "#0369a1"
                          : "#22863a",
                      fontSize: "13px",
                    }}
                  >
                    {notif.message}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notif.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <X
                    size={18}
                    style={{
                      color:
                        notif.type === "new-conversation"
                          ? "#0284c7"
                          : "#16a34a",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* 🟢 Incoming Call Modal */}
          {callState === CallState.IncomingCall && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <Phone size={24} color="blue" />
                  <h3>Incoming {callType} call</h3>
                  <p>Caller: {caller}</p>
                </div>
                <div className="modal-actions">
                  <button className="modal-btn btn-success" onClick={answerCall}>
                    Answer
                  </button>
                  <button className="modal-btn confirm" onClick={handleEndCall}>
                    Deny
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🎥 Video Call Overlay */}
          {callState === CallState.InCall && (
            <div
              className="video-call-overlay"
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                zIndex: 9999,
              }}
            >
              {/* Remote Video */}
              <video
                ref={userVideo}
                autoPlay
                playsInline
                className="remote-video"
                style={{
                  width: "70%",
                  borderRadius: "12px",
                  backgroundColor: "black",
                  transform: "scaleX(-1)",
                }}
              />

              {/* Local (Self) Video */}
              <video
                ref={myVideo}
                autoPlay
                playsInline
                muted
                className="local-video"
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  width: "200px",
                  height: "150px",
                  borderRadius: "12px",
                  border: "2px solid white",
                  backgroundColor: "black",
                  transform: "scaleX(-1)",
                }}
              />

              <button
                className="modal-btn confirm"
                style={{ marginTop: "20px" }}
                onClick={handleEndCall}
              >
                Hangup
              </button>
            </div>
          )}

          {/* Normal content */}
          <Outlet
            context={{
              callState,
              setCallState,
              callType,
              setCallType,
              incomingCall,
              setIncomingCall,
              receivingCall,
              setReceivingCall,
              caller,
              setCaller,
              answerCall,
              handleEndCall,
              myVideo,
              userVideo,
              socketRefClient,
              socketRefAgent,
              connectionRef,
              removeNotification,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}