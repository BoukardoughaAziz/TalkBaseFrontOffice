import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from "simple-peer";
import { IconMicrophone, IconPhone, IconVideo } from '@tabler/icons-react';
import CallState from '../../models/CallState'

interface ChatWithVideoCallProps {
  setCallState : (CallState: CallState) => void; 
  callState: CallState;
  me: string;
  setMe: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChatWithVideoCall({ setCallState,callState, me, setMe }: ChatWithVideoCallProps) {

  const socketRefClient = useRef<Socket | null>(null);
  const socketRefAgent = useRef<Socket | null>(null);

  // Simple Peer video call logic
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [idToCall, setIdToCall] = useState("");
  const [name, setName] = useState("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true); 
  
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);



  // Get user media on component mount
  useEffect(() => {


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
    
    return () => {
      // Cleanup streams when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketClient) {
        socketClient.off("me");
        socketClient.off("callUser");
      }
    };
  }, []);

  const callUser = () => {
    if (!idToCall || !name || !stream) return;
    
    console.log("this is the id we're calling : ", idToCall);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socketRefClient.current?.emit("calluser", {
        userToCall: idToCall,
        signalData: data,
        from: me,
        to: idToCall,
        name: name
      });
    });

    peer.on("stream", (remoteStream) => {		
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    socketRefClient.current?.on("callaccepted", (signal) => {
      console.log("call accepted was called : ", signal);
      setCallState(CallState.InCall);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  }

  const answerCall = () => {  
    console.log("answering the call");

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }
        setCallState(CallState.InCall);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: mediaStream
        });

        peer.on("signal", (data) => {
          console.log("this is the caller", caller);
          socketRefClient.current?.emit("answercall", { signal: data, to: caller });
        });

        peer.on("stream", (remoteStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = remoteStream;
          }
        });
        peer.signal(callerSignal);
        connectionRef.current = peer;
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        // Fallback to audio only
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((mediaStream) => {
            setStream(mediaStream);
            setCallState(CallState.InCall);
            const peer = new Peer({
              initiator: false,
              trickle: false,
              stream: mediaStream
            });
            peer.on("signal", (data) => {
              socketRefClient.current?.emit("answercall", { signal: data, to: caller });
            });
            peer.on("stream", (remoteStream) => {
              if (userVideo.current) {
                userVideo.current.srcObject = remoteStream;
              }
            });
            peer.signal(callerSignal);
            connectionRef.current = peer;
          })
          .catch((err) => console.error("Error accessing audio:", err));
      });
  }

const leaveCall = () => {
  console.log("leaving the call");
  setCallState(CallState.ended);

  // Stop camera & microphone
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  // Destroy peer connection
  if (connectionRef.current) {
    connectionRef.current.destroy();
  }

  // Optional: callback for parent component
  // if (onEndCall) {
  //   onEndCall();
  // }
}


  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // In declineCall, set state to idle
  const declineCall = () => {
    setCaller("");
    setCallerSignal(null);
    setCallState(CallState.Idle);
  };

  return (
    <div className="h-full w-full">
      {/* Call Setup UI (when not in call)
      {callState=== CallState.Idle && (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Start a Video Call</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID to Call</label>
                <input
                  type="text"
                  placeholder="Enter recipient's ID"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-center pt-2">
                <button
                  onClick={callUser}
                  disabled={!idToCall || !name}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Start Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Active Call UI */}
      {callState=== CallState.InCall  && (
        <div className="relative h-full w-full bg-black">
          {/* Remote video (full screen) */}
          <video
            ref={userVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {/*
          Local video (picture-in-picture)
          <video
            ref={myVideo}
            autoPlay
            playsInline
            muted
            className="absolute bottom-20 right-4 w-1/4 h-1/4 object-cover rounded-lg border-2 border-white"
          />
          */}
          {/* Call controls overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-50 p-3 rounded-lg">
            <button
              className={
                "text-white " +
                (isAudioEnabled
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-red-500 hover:bg-red-600")
              }
              onClick={toggleAudio}
            >
              <IconMicrophone size={20} />
            </button>
            
            <button
              className={
                "text-white " +
                (isVideoEnabled
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-red-500 hover:bg-red-600")
              }
              onClick={toggleVideo}
            >
              <IconVideo size={20} />
            </button>
            
            <button 
              className="text-white bg-red-500 hover:bg-red-600"
              onClick={leaveCall}
            >
              <IconPhone size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Incoming Call UI */}
      {callState=== CallState.IncomingCall  && (
        <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white p-4">
          <div className="w-full max-w-md text-center">
            <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center mb-6 mx-auto">
              <IconVideo size={48} />
            </div>
            
            <h3 className="text-2xl font-semibold mb-2">{name} is calling...</h3>
            <p className="text-gray-300 mb-8">Incoming video call</p>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={answerCall}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full"
              >
                <IconPhone size={20} className="mr-2" />
                Answer
              </button>
              
              <button 
                onClick={declineCall}
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full"
              >
                <IconPhone size={20} className="mr-2" />
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}