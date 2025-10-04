import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AppClient } from '@/models/AppClient';
import ChatDirection from '@/models/ChatDirection';
import ChatEvent from '@/models/ChatEvent';
import { ChatMessage } from '@/models/ChatMessage';
import { useWebSocket } from '@/context/WebSocketProvider';
import { AppMap } from '@/components/AppMap';
import ClientInformationUI from '../ClinetInformation/ClientInformationUI';
import AppStack from './AppStack';
import CallStatus from './CallStatus';
import './Chat.css';
import ChatConversation from './ChatConversation';
import ChatLeftSide from './ChatLeftSide';
import conversationService from '@/services/Conversation/conversationService';
import { Conversation } from '@/models/Conversation';
import { ClientInformation } from '@/models/ClientInformation';
import ChatWithVideoCall from './ChatWithVideoCall';
import CallState from '../../models/CallState';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import AppBrowser from '@/models/AppBrowser';
import AppOS from '@/models/AppOS';
import { AppAgent } from '@/models/AppAgent';


export default function Chat() {
  // State management
  const [search, setSearch] = useState('');
  const [me, setMe] = useState("");
  const [input, setInput] = useState('');
  const [selectedAppClient, setSelectedAppClient] = useState<AppClient | undefined>(undefined);
  const [conversation, setConversation] = useState<Conversation>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convo, setConvo] = useState<Conversation>();
  const [clientInformation, setClientInformation] = useState<ClientInformation>();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [incomingCall, setIncomingCall] = useState<{from: string, type: 'audio' | 'video'} | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [callState, setCallState] = useState<CallState>(CallState.Idle);
  const [connectedAgent, setConnectedAgent] = useState<AppAgent | null>(null);

  // Refs
  const socketRefAgent = useRef<Socket | null>(null);
  const socketRefClient = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);
  const messageEndRef = useRef(null);
  const notificationSound = useState(new Audio('../../public/notif.wav'))[0];
  const audioRef = useRef(null);
  const socket = useWebSocket();

  // WebRTC functions
  const calluser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socketRefClient.current?.emit("calluser", {
        userToCall: idToCall,
        signalData: data,
        from: convo?.AppClientID,
        name: convo?.AppClientID,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socketRefClient.current?.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answercall = () => {
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
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leavecall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
  };

  const endCall = () => {
    console.log("Ending call");
    leavecall();
    setCallState(CallState.Idle);
  };

  // Socket initialization
  useEffect(() => {
    console.log("chat component has been mounted");
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

    socketAgent.once("me", (id) => {
      console.log("Socket ID from server:", id);
      setMe(id);

      axios.post(`${import.meta.env.VITE_BACKEND_URL}/CallCenterAuthController/update-socket-id`, {
        agentId: connectedAgent?._id,
        socketId: id,
      }).catch((err) => {
        console.error("Failed to update socket id:", err);
      });

      const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [key, value] = current.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      console.log("Parsed cookies:", cookies);

      const userJson = cookies['user'];
      if (userJson) {
        const user = JSON.parse(decodeURIComponent(userJson));
        console.log("Logged in user:", user);
        user.SocketId = id;
        setConnectedAgent(user);
      }

    }); 

    
  if(connectedAgent){
    console.log("Connected Agent Socket ID was set:", connectedAgent);
  }



    socketClient.on("callUser", (data) => {
      console.log("this is the data from callUser:", data);
      if(data.from !== me && data.to === me) {
        console.log("THIS CALL IS FOR ME")
        setReceivingCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
        setCallState(CallState.IncomingCall);
        setIncomingCall({ from: data.from, type: data.type });
      }
    });

    return () => {
    };
  }, [me]);

  // Message handling
  useEffect(() => {
    if (socket && convo?.AppClientID) {
      socket.emit('joinConversation-agent', { ConversationId: convo.AppClientID });
    }
  }, [socket, convo?.AppClientID]);

  useEffect(() => {
    if (socket) {
      socket.on('MESSAGE_FROM_AGENT_TO_CLIENT', (incomingMessage: ChatMessage) => {
        setConversation((prevConversation) => {
          const updatedConversation = { ...prevConversation };
          if (incomingMessage.conversationId) {
            if (!updatedConversation[incomingMessage.conversationId]) {
              updatedConversation[incomingMessage.conversationId] = [];
            }
            updatedConversation[incomingMessage.conversationId].push(incomingMessage);
          }
          return updatedConversation;
        });
      });
      
      socket.on('MESSAGE_FROM_CLIENT_TO_AGENT', (incomingMessage: ChatMessage) => {
        setConversation((prevConversation) => {
          const updatedConversation = { ...prevConversation };
          if (incomingMessage.conversationId) {
            if (!updatedConversation[incomingMessage.conversationId]) {
              updatedConversation[incomingMessage.conversationId] = [];
            }
            updatedConversation[incomingMessage.conversationId].push(incomingMessage);
          }
          return updatedConversation;
        });
      });
    }

    return () => {
      socket?.off('MESSAGE_FROM_AGENT_TO_CLIENT');
      socket?.off('MESSAGE_FROM_CLIENT_TO_AGENT');
    };
  }, [socket]);

  // Message scrolling
  useEffect(() => {
    if (messageEndRef.current) {
      const chatContainer = messageEndRef.current.parentElement;
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [conversation]);

  // Send message handler
  const handleSendChatMessage = () => {
    console.log("handleSendChatMessage was called");
    if (!input.trim()) return;
    
    const chatMessage: ChatMessage = {
      message: input,
      timestamp: new Date(),
      identifier: convo?.AppClientID || '',
      conversationId: convo?.AppClientID || '',
      chatDirection: ChatDirection.FromAgentToCLient,
      appClient: {
        identifier: convo?.AppClientID || '',
        humanIdentifier: convo?.AppClientID || '',
        appOS: AppOS.Win,
        appBrowser: AppBrowser.Edge,
        ipAddress: "192.168.1.1",
        city: "Mock City",
        org: "Mock Organization",
        countryCode: "MC",
        associatedAgent: {
          identifier: "mock-associated-agent-id",
          humanIdentifier: "mock-associated-human-identifier",
          appOS: { name: "mock-associated-os", version: "2.0.0" },
          appBrowser: { name: "mock-associated-browser", version: "2.0.0" },
          ipAddress: "192.168.1.2",
          city: "Mock Associated City",
          org: "Mock Associated Organization",
          countryCode: "MA",
        },
      },
      chatEvent: ChatEvent.MessageFromAgentToClient,
    };

    socket?.emit('add-message-agent', chatMessage);
    setInput('');
  };

  // Conversation initialization
  useEffect(() => {
    conversationService.getConversations()
      .then(setConversations)
      .catch(console.error);
  }, []);

  return (
    <div className='hk-pg-wrapper pb-0'>
      <div className='hk-pg-body py-0'>
        <div className='chatapp-wrap chatapp-info-active'>
          <div className='chatapp-content'>
            
            {/* <ChatLeftSide
              conversations={conversations}
              setConvo={setConvo}
              ClientInformation={clientInformation}
              setClientInformation={setClientInformation}
            /> */}

            <div className='chatapp-single-chat'>
              {/* Combined Chat Header */}
              <header className='chat-header'>
                {callState === CallState.IncomingCall && incomingCall && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                      <h3 className="text-xl font-semibold mb-2">
                        Incoming {incomingCall.type === 'video' ? 'Video' : 'Audio'} Call
                      </h3>
                      <p className="mb-4">From: {convo?.AppClientID}</p>
                      <div className="flex justify-center gap-4">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={endCall}
                        >
                          Reject
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={answercall}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <a className='btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover back-user-list' href='#'>
                  <span className='icon'>
                    <span className='feather-icon'>
                      <i data-feather='chevron-left'></i>
                    </span>
                  </span>
                </a>
                
                <div className='media'>
                  {convo && (
                    <>
                      <div className='media-head'>
                        <div className='avatar avatar-sm avatar-rounded position-relative'>
                          <img src='../assets/img/avatar8.jpg' alt='user' className='avatar-img' />
                          <span className={`badge ${callState === CallState.Idle ? 'badge-success' : 'badge-secondary'} badge-indicator badge-indicator-lg position-bottom-end-overflow-1`}></span>
                        </div>
                      </div>
                      <div className='media-body'>
                        <div className='user-name'>
                          {convo.AppClientID}
                        </div>
                        <div className='user-status'>
                          {callState === CallState.InCall ? 'In Call' : 
                          callState === CallState.IncomingCall ? 'Incoming Call' : 'Online'}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className='chat-options-wrap'>
                  <button
                    className={`btn btn-icon btn-flush-dark btn-rounded flush-soft-hover d-none d-xl-block ${
                      callState === CallState.InCall && callType === 'audio' ? 'text-green-500' : ''
                    }`}
                    onClick={() => callState === CallState.Idle ? calluser() : endCall()}
                    disabled={!!incomingCall}
                  >
                    <span className='icon' title={callState === CallState.Idle ? 'Audio call' : 'End call'}>
                      <span className='feather-icon'>
                        <i data-feather='phone'></i>
                      </span>
                    </span>
                  </button>
                  
                  <button
                    className={`btn btn-icon btn-flush-dark btn-rounded flush-soft-hover d-none d-xl-block ${
                      callState === CallState.InCall && callType === 'video' ? 'text-green-500' : ''
                    }`}
                    onClick={() => callState === CallState.Idle ? calluser() : endCall()}
                    disabled={!!incomingCall}
                  >
                    <span className='icon' title={callState === CallState.Idle ? 'Video Call' : 'End call'}>
                      <span className='feather-icon'>
                        <i data-feather='video'></i>
                      </span>
                    </span>
                  </button>

                  <a className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover chatapp-info-toggle active' href='#'>
                    <span className='icon' title='Info'>
                      <span className='feather-icon'>
                        <i data-feather='info'></i>
                      </span>
                    </span>
                  </a>
                  
                  <a className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret' href='#'>
                    <span className='icon' title='More'>
                      <span className='feather-icon'>
                        <i data-feather='more-vertical'></i>
                      </span>
                    </span>
                  </a>      
                </div>

                {/* Remote Video Stream Overlay */}
                {callState === CallState.InCall && callType === 'video' && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="relative bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col items-center">
                      <div className="relative flex-1 bg-black">
                        <video 
                          ref={myVideo} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover"
                        />
                        {callAccepted && !callEnded && (
                          <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute bottom-4 right-4 w-1/4 h-1/4 object-cover rounded-lg border-2 border-white"
                          />
                        )}
                      </div>
                      {hasRemoteVideo ? (
                        <div className="mt-2 text-green-400 font-bold">✅ Remote video is streaming!</div>
                      ) : (
                        <div className="mt-2 text-red-400 font-bold">❌ No remote video track yet</div>
                      )}
                    </div>
                  </div>
                )}
              </header>

              {/* Conversation Area */}
              {callState === CallState.Idle ? (
                <ChatConversation
                  conversation={convo}
                  setConversation={setConvo}
                  ClientInformation={clientInformation}
                  setClientInformation={setClientInformation}
                  conversations={conversations}
                  setConversations={setConversations}
                  setConvo={setConvo}
                />
              ) : (
                <ChatWithVideoCall
                  setCallState={setCallState} 
                  callState={callState}
                  me={me}
                  setMe={setMe}
                />
              )}
              
              {/* Combined Chat Footer */}
              <footer className="chat-footer">
                <button
                  className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover flex-shrink-0"
                  data-bs-toggle="dropdown"
                >
                  <span className="icon">
                    <span className="feather-icon">
                      <i data-feather="share"></i>
                    </span>
                  </span>
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-icon avatar-xs avatar-soft-primary avatar-rounded me-3">
                        <span className="initial-wrap">
                          <i className="ri-image-line"></i>
                        </span>
                      </div>
                      <div>
                        <span className="h6 mb-0">Photo or Video Library</span>
                      </div>
                    </div>
                  </a>
                  {/* ... other dropdown items ... */}
                </div>
                <div className="input-group">
                  <span className="input-affix-wrapper">
                    <input
                      type="text"
                      className="input-msg-send form-control rounded-input"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    />
                    <span className="input-suffix">
                      <button
                        className="btn btn-icon btn-flush-primary btn-rounded btn-send"
                        onClick={handleSendChatMessage}
                      >
                        <span className="icon">
                          <span className="feather-icon">
                            <i data-feather="arrow-right"></i>
                          </span>
                        </span>
                      </button>
                    </span>
                  </span>
                </div>
                <button className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover">
                  <span className="icon">
                    <span className="feather-icon">
                      <i data-feather="smile"></i>
                    </span>
                  </span>
                </button>
              </footer>
              
              <ClientInformationUI
                clientInformation={clientInformation}
                conversation={convo}
                setClientInformation={setClientInformation}
              />
            </div>

        
              <div
                id='audio_call'
                className='modal fade'
                tabIndex={-1}
                role='dialog'
                aria-hidden='true'
              >
                <div
                  className='modal-dialog modal-dialog-centered modal-xl chatapp-call-window'
                  role='document'
                >
                  <div className='modal-content'>
                    <div className='modal-header header-wth-bg'>
                      <h6 className='modal-title text-muted'>
                        Jampack Audio Call
                      </h6>
                      <div className='modal-action'>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-flush-dark btn-rounded flush-soft-hover modal-fullscreen-togglable'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='maximize'></i>
                            </span>
                            <span className='feather-icon d-none'>
                              <i data-feather='minimize'></i>
                            </span>
                          </span>
                        </a>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-flush-dark btn-rounded flush-soft-hover'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='help-circle'></i>
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className='modal-body'>
                      <div className='avatar avatar-xxxl avatar-rounded d-20'>
                        <img
                          src='../assets/img/avatar8.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                      <h3 className='mt-3'>Huma Therman</h3>
                      <p>
                        Audio Calling<span className='one'>.</span>
                        <span className='two'>.</span>
                        <span className='three'>.</span>
                      </p>
                    </div>
                    <div className='modal-footer'>
                      <ul className='chatapp-call-action hk-list'>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='mic'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='video'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button
                            className='btn btn-icon btn-lg btn-rounded btn-danger'
                            data-bs-dismiss='modal'
                          >
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='phone'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='user-plus'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='more-vertical'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                      <div className='avatar avatar-lg avatar-rounded chatapp-caller-img'>
                        <img
                          src='../assets/img/avatar13.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id='video_call'
                className='modal fade'
                tabIndex={-1}
                role='dialog'
                aria-hidden='true'
              >
                <div
                  className='modal-dialog modal-dialog-centered modal-xl chatapp-call-window'
                  role='document'
                >
                  <div className='modal-content bg-primary-dark-5'>
                    <div className='modal-header header-wth-bg bg-primary-dark-3'>
                      <h6 className='modal-title text-muted'>
                        Jampack Video Call
                      </h6>
                      <div className='modal-action'>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-rounded btn-link link-secondary modal-fullscreen-togglable'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='maximize'></i>
                            </span>
                            <span className='feather-icon d-none'>
                              <i data-feather='minimize'></i>
                            </span>
                          </span>
                        </a>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-rounded btn-link link-secondary'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='help-circle'></i>
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className='modal-body'>
                      <div className='avatar avatar-xxxl avatar-rounded d-20'>
                        <img
                          src='../assets/img/avatar8.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                      <h3 className='text-white mt-3'>Huma Therman</h3>
                      <p className='text-white'>
                        Video Calling<span className='one'>.</span>
                        <span className='two'>.</span>
                        <span className='three'>.</span>
                      </p>
                    </div>
                    <div className='modal-footer'>
                      <ul className='chatapp-call-action hk-list'>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='mic'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='video'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button
                            className='btn btn-icon btn-lg btn-rounded btn-danger'
                            data-bs-dismiss='modal'
                          >
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='phone'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='user-plus'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='more-vertical'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                      <div className='avatar avatar-lg avatar-rounded chatapp-caller-img'>
                        <img
                          src='../assets/img/avatar13.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className='modal fade'
                id='invite_people'
                tabIndex={-1}
                role='dialog'
              >
                <div
                  className='modal-dialog modal-dialog-centered mw-400p'
                  role='document'
                >
                  <div className='modal-content'>
                    <div className='modal-header header-wth-bg-inv'>
                      <h5 className='modal-title'>Invite People</h5>
                      <button
                        type='button'
                        className='btn-close text-white'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                      >
                        <span aria-hidden='true'>×</span>
                      </button>
                    </div>
                    <div className='modal-body p-0'>
                      <form className='m-3' role='search'>
                        <input
                          type='text'
                          className='form-control rounded-input user-search'
                          placeholder='Search People'
                        />
                      </form>
                    </div>
                    <div className='modal-footer justify-content-center'>
                      <button
                        type='button'
                        className='btn flex-fill btn-light flex-1'
                        data-bs-dismiss='modal'
                      >
                        Cancel
                      </button>
                      <button
                        type='button'
                        className='btn flex-fill btn-primary flex-1'
                      >
                        Invite for chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
