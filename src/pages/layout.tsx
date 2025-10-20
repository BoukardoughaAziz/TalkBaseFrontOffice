import { Outlet } from "react-router-dom";
import Sidebar from "./statisticsDashboard/Sidebar";
import { useEffect, useState, useRef } from "react";
import { AppAgent } from "@/models/AppAgent";
import Cookies from "js-cookie";
import { useConversation } from "@/context/ConversationContext";
import { io, Socket } from "socket.io-client";
import CallState from "@/models/CallState";
import Peer from "simple-peer";

export default function Layout() {
  const { connectedAgent, setConnectedAgent, socketid, conversations, convo } = useConversation();
  
  // Call state
  const [callState, setCallState] = useState<CallState>(CallState.Idle);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [incomingCall, setIncomingCall] = useState<{from: string, type: 'audio' | 'video'} | null>(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [stream, setStream] = useState();

  // Refs
  const socketRefClient = useRef<Socket | null>(null);
  const socketRefAgent = useRef<Socket | null>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);

  const connectedAgentRef = useRef(connectedAgent);
  const socketidRef = useRef(socketid);
  const callstateRef = useRef(callState);
  const conversationsRef = useRef(conversations);

  // Keep refs in sync
  useEffect(() => {
    connectedAgentRef.current = connectedAgent;
  }, [connectedAgent]);

  useEffect(() => {
    socketidRef.current = socketid;
  }, [socketid]);

  useEffect(() => {
    callstateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Initialize sockets and set up listeners
  useEffect(() => {
    console.log("layout has mounted")
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

    // Listen for incoming calls
    socketClient.on("callUser", (data) => {
      if (data.to === socketidRef.current) {
        console.log("Incoming call for me:", data);
        
        setIncomingCall({
          from: data.from,
          type: data.calltype || 'audio'
        });
        
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
        setCallState(CallState.IncomingCall);
        setCallType(data.calltype || 'audio');
      }
    });

    // Cleanup on unmount
    return () => {
      socketClient?.off("callUser");
    };
  }, []);

  const answerCall = async () => {
    try {
      console.log("ANSWERING CALL");

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true
      });

      // setStream(localStream);

      if (myVideo.current) {
        myVideo.current.srcObject = localStream;
      }

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: localStream
      });

      peer.on("signal", (data) => {
        socketRefClient.current?.emit("answercall", {
          signal: data,
          to: caller
        });
      });

      peer.on("stream", (remoteStream) => {
        console.log("Received remote stream");
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
      console.error("Error answering call:", error);
    }
  };

  const handleEndCall = () => {
    console.log("ENDING CALL");
    
    // Clean up peer connection
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }

    // Stop all tracks in streams
    // if (stream) {
    //   stream.getTracks().forEach(track => track.stop());
    //   setStream(null);
    // }

    setCallState(CallState.Idle);
    setCallType(null);
    setIncomingCall(null);
    setReceivingCall(false);
    setCaller("");
  };

  // Expose socket and call functions to child components via context if needed
  // Or render call UI here if it should be global

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Route content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Outlet context={{
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
            connectionRef
          }} />
        </div>
      </div>
    </div>
  );
}