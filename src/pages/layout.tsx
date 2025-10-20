import { Outlet } from "react-router-dom";
import Sidebar from "./statisticsDashboard/Sidebar";
import { useEffect, useState, useRef } from "react";
import { useConversation } from "@/context/ConversationContext";
import { io, Socket } from "socket.io-client";
import CallState from "@/models/CallState";
import Peer from "simple-peer";
import { Phone } from "lucide-react";

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
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // ---- Refs ----
  const socketRefClient = useRef<Socket | null>(null);
  const socketRefAgent = useRef<Socket | null>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);
  const socketidRef = useRef(socketid);
  const peerRef = useRef<any>(null);

  useEffect(() => {
    socketidRef.current = socketid;
  }, [socketid]);

  // ---- Update video elements when streams change ----
  useEffect(() => {
    if (myVideo.current && stream) {
      console.log("🎬 Setting local stream to myVideo");
      myVideo.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (userVideo.current && remoteStream) {
      console.log("📹 Setting remote stream to userVideo");
      userVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

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

    // Listen for answer acknowledgment
    socketClient.on("callAnswered", (data) => {
      console.log("✅ Call answered, applying answer signal");
      if (peerRef.current && data.signal) {
        try {
          peerRef.current.signal(data.signal);
        } catch (error) {
          console.error("Error applying answer signal:", error);
        }
      }
    });

    return () => {
      socketClient?.off("callUser");
      socketClient?.off("callAnswered");
    };
  }, []);

  // ---- Answer call ----
  const answerCall = async () => {
    try {
      console.log("✅ Answering call...");

      // Get media stream
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

      console.log("🎤 Local stream obtained:", localStream.getTracks());
      setStream(localStream);

      // Create peer connection as non-initiator
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: localStream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      });

      // When we generate a signal, send it back to the caller
      peer.on("signal", (signalData) => {
        console.log("📤 Generated answer signal, sending to caller:", caller);
        socketRefClient.current?.emit("answercall", {
          signal: signalData,
          to: caller,
        });
      });

      // When we receive the remote stream
      peer.on("stream", (incomingStream) => {
        console.log("🎥 Received remote stream with tracks:", incomingStream.getTracks());
        setRemoteStream(incomingStream);
      });

      // Handle errors
      peer.on("error", (err) => {
        console.error("❌ Peer connection error:", err);
      });

      peer.on("close", () => {
        console.log("Connection closed");
      });

      // Apply caller's initial offer signal
      if (callerSignal) {
        console.log("📥 Applying caller signal");
        try {
          peer.signal(callerSignal);
        } catch (error) {
          console.error("Error signaling back to caller:", error);
        }
      }

      peerRef.current = peer;
      connectionRef.current = peer;
      setCallState(CallState.InCall);
    } catch (error) {
      console.error("❌ Error answering call:", error);
      alert(`Failed to access camera/microphone: ${error}`);
    }
  };

  // ---- End call ----
  const handleEndCall = () => {
    console.log("📴 Ending call");

    // Destroy peer connection
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch (e) {
        console.error("Error destroying peer:", e);
      }
      peerRef.current = null;
    }

    if (connectionRef.current) {
      try {
        connectionRef.current.destroy();
      } catch (e) {
        console.error("Error destroying connection:", e);
      }
      connectionRef.current = null;
    }

    // Stop local stream
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }

    // Clear video elements
    if (myVideo.current) {
      myVideo.current.srcObject = null;
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }

    setRemoteStream(null);
    setCallState(CallState.Idle);
    setCallType(null);
    setIncomingCall(null);
    setReceivingCall(false);
    setCaller("");
    setCallerSignal(null);
  };

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
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
                key="remote-video"
                ref={userVideo}
                autoPlay
                playsInline
                className="remote-video"
                style={{
                  width: "70%",
                  height: "auto",
                  borderRadius: "12px",
                  backgroundColor: "black",
                  transform: "scaleX(-1)",
                }}
              />

              {/* Local (Self) Video */}
              <video
                key="local-video"
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
            }}
          />
        </div>
      </div>
    </div>
  );
}