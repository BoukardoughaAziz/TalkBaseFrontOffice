import { useWebSocket } from "@/context/WebSocketProvider";
import { ClientInformation } from "@/models/ClientInformation";
import { Conversation } from "@/models/Conversation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';

interface ChatHeaderProps {
  conversation: Conversation | null;
  setConversation: (conversation: Conversation) => void;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  ClientInformation: ClientInformation;
  setClientInformation: (clientInformation: ClientInformation) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onAcceptCall: () => void;
  onRejectCall: () => void;
  me: string;
  setMe: React.Dispatch<React.SetStateAction<string>>;
}

export default function ChatHeader(props: ChatHeaderProps) {
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active'>('idle');
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [incomingCall, setIncomingCall] = useState<{from: string, type: 'audio' | 'video'} | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const socketRefAgent = useRef<Socket | null>(null);
  const socketRefClient = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);  



  
  //new code :
  const [ stream, setStream ] = useState<MediaStream | undefined>()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef<HTMLVideoElement>(null);
	const userVideo = useRef<HTMLVideoElement>(null);
	const connectionRef= useRef(null)


  useEffect(() => {
    socketRefClient.current?.on("callUser" , (data) => {
      console.log("callUser event received", data);
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
      setName(data.name);
    })

  }, [])


  const calluser=()=>{
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream : stream
    })


    peer.on("signal", (data) => {
      socketRefClient.current?.emit("calluser", {
        userToCall: idToCall,
        signalData: data,
        from: props.conversation?.AppClientID,
        name: props.conversation?.AppClientID,
      });
    });


    peer.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      
    });


    socketRefClient.current?.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    })   

    connectionRef.current = peer;
  }


  const answercall=()=>{
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    }); 

    peer.on("signal", (data) => {
      socketRefClient.current?.emit("answercall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  }

  const leavecall=() =>{
    setCallEnded(true);
    connectionRef.current?.destroy();
   
  }

  

    const endCall = ()=>{
      console.log("Ending call");      
    }



  useEffect(() => {
    if (!socketRefAgent.current) {
      socketRefAgent.current = io(import.meta.env.VITE_SOCK_JS_CALL_CENTER_URL, {
        transports: [import.meta.env.VITE_SOCK_JS_TRANSPORT_PROTOCOL],
      });
    }

    if (!socketRefClient.current) {
      socketRefClient.current = io(import.meta.env.VITE_SOCK_JS_WIDGET_URL, {
        transports: [import.meta.env.VITE_SOCK_JS_TRANSPORT_PROTOCOL],
      });
    }

    const socketAgent = socketRefAgent.current;
    const socketClient = socketRefClient.current;

  

    return () => {
      endCall();
    };
  }, [props.conversation?.AppClientID]);



  return (
    <header className='chat-header'>
      {/* Incoming Call Modal */}
      {callState === 'ringing' && incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">
              Incoming {incomingCall.type === 'video' ? 'Video' : 'Audio'} Call
            </h3>
            <p className="mb-4">From: {props.conversation?.AppClientID}</p>
            
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white"
                // onClick={rejectCall}
              >
                <i className="mr-2" />
                Reject
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white"
                // onClick={acceptCall}
              >
                {incomingCall.type === 'video' ? (
                  <i  className="mr-2" />
                ) : (
                  <i  className="mr-2" />
                )}
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Content */}
      <a
        id='back_user_list'
        className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover back-user-list'
        href='#'
      >
        <span className='icon'>
          <span className='feather-icon'>
            <i data-feather='chevron-left'></i>
          </span>
        </span>
      </a>
      
      <div className='media'>
        {props.conversation && (
          <>
            <div className='media-head'>
              <div className='avatar avatar-sm avatar-rounded position-relative'>
                <img
                  src='../assets/img/avatar8.jpg'
                  alt='user'
                  className='avatar-img'
                />
                <span className={`badge ${callState === 'active' ? 'badge-success' : 'badge-secondary'} badge-indicator badge-indicator-lg position-bottom-end-overflow-1`}></span>
              </div>
            </div>
            <div className='media-body'>
              <div className='user-name'>
                {props.conversation.AppClientID}
              </div>
              <div className='user-status'>
                {callState === 'active' ? 'In Call' : 
                 callState === 'ringing' ? (incomingCall ? 'Incoming Call' : 'Calling...') : 'Online'}
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className='chat-options-wrap'>
        <button
          className={`btn btn-icon btn-flush-dark btn-rounded flush-soft-hover d-none d-xl-block ${
            callState === 'active' && callType === 'audio' ? 'text-green-500' : ''
          }`}
          onClick={() => callState === 'idle' ? calluser() : endCall()}
          disabled={!!incomingCall}
        >
          <span
            className='icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title=''
            data-bs-original-title={callState === 'idle' ? 'Audio call' : 'End call'}
          >
            <span className='feather-icon'>
              <i data-feather='phone'></i>
            </span>
          </span>
        </button>
        
        <button
          className={`btn btn-icon btn-flush-dark btn-rounded flush-soft-hover d-none d-xl-block ${
            callState === 'active' && callType === 'video' ? 'text-green-500' : ''
          }`}
          onClick={() => callState === 'idle' ? calluser() : endCall()}
          disabled={!!incomingCall}
        >
          <span
            className='icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title=''
            data-bs-original-title={callState === 'idle' ? 'Video Call' : 'End call'}
          >
            <span className='feather-icon'>
              <i data-feather='video'></i>
            </span>
          </span>
        </button>

        <a
          className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover chatapp-info-toggle active'
          href='#'
        >
          <span
            className='icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title=''
            data-bs-original-title='Info'
          >
            <span className='feather-icon'>
              <i data-feather='info'></i>
            </span>
          </span>
        </a>
        
        <a
          className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
          href='#'
          data-bs-toggle='dropdown'
        >
          <span
            className='icon'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            title=''
            data-bs-original-title='More'
          >
            <span className='feather-icon'>
              <i data-feather='more-vertical'></i>
            </span>
          </span>
        </a>      
        </div>

      {/* Remote Video Stream Overlay */}
      {callState === 'active' && callType === 'video' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col items-center">
        <div className="relative flex-1 bg-black">
          <video 
            ref={myVideo} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        {callAccepted && !callEnded ?
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 w-1/4 h-1/4 object-cover rounded-lg border-2 border-white"
          />	:				
          null}

        </div>
            {hasRemoteVideo ? (
              <div className="mt-2 text-green-400 font-bold bg-red-500">✅ Remote video is streaming!</div>
            ) : (
              <div className="mt-2 text-red-400 font-bold">❌ No remote video track yet</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}