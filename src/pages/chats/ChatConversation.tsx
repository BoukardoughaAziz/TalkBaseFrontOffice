import { AppAgent } from '@/models/AppAgent';
import ChatDirection from '@/models/ChatDirection';
import ChatEvent from '@/models/ChatEvent';
import { ChatMessage } from '@/models/ChatMessage';
import { ClientInformation } from '@/models/ClientInformation';
import { Conversation } from '@/models/Conversation';
import { SenderType } from '@/models/SenderType';
import conversationService from '@/services/Conversation/conversationService';
import { ChevronLeft, FileText, Image, Info, MapPin, MoreVertical, Paperclip, Phone, PhoneCall, Send, Smile, Users, Video, VideoIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';


interface ChatConversationsProps {
  conversation: Conversation | null;
  setConversation: (conversation: Conversation) => void;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  ClientInformation: ClientInformation;
  setClientInformation: (clientInformation: ClientInformation) => void;
  connectedAgent: AppAgent;
  setConnectedAgent: (agent: AppAgent) => void;
}


export default function ChatConversations({
  conversation ,
  setConversation,
  conversations ,
  setConversations,
  ClientInformation ,
  setConnectedAgent,
  connectedAgent
}: ChatConversationsProps) {
  const [input, setInput] = useState('');
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'active'>('idle');
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{from: string, type: 'audio' | 'video'} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const [showClientInfo, setShowClientInfo] = useState<boolean>(false);


  const socketRefClient = useRef<Socket | null>(null);
  const socketRefAgent  = useRef<Socket | null>(null);
  // Auto-scroll to bottom when messages change


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
    const socketAgent = socketRefAgent.current;
  }, []);

  useEffect(() => {
    console.log("the chat conversation component loaded")
  // Handle incoming client messages
  socketRefClient.current?.on('MESSAGE_FROM_CLIENT_TO_AGENT', (message: ChatMessage) => {
    console.log('New message from client:', message);
    
    // Only add the message if it belongs to the current conversation
    if (conversation && message.conversationId === conversation.AppClientID) {
      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, message]
      };

      // Update current conversation
      setConversation(updatedConversation);
      
      // Update conversations list
      setConversations(conversations.map(conv => 
        conv.AppClientID === updatedConversation.AppClientID 
          ? updatedConversation 
          : conv
      ));
    }
  });

  // Handle incoming agent messages (for multi-agent scenarios)
  socketRefAgent.current?.on('MESSAGE_FROM_AGENT_TO_CLIENT', (message: ChatMessage) => {
    console.log('New message from agent:', message);
    
    if (conversation && message.conversationId === conversation.AppClientID) {
      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, message]
      };

      setConversation(updatedConversation);
      setConversations(conversations.map(conv => 
        conv.AppClientID === updatedConversation.AppClientID 
          ? updatedConversation 
          : conv
      ));
    }
  });

  // Auto-scroll when new messages arrive
  scrollToBottom();

  // Cleanup function to remove listeners
  return () => {
    socketRefClient.current?.off('MESSAGE_FROM_CLIENT_TO_AGENT');
    socketRefAgent.current?.off('MESSAGE_FROM_AGENT_TO_CLIENT');
  };
}, [conversation, conversations, setConversation, setConversations]);



  useEffect(() => {
  console.log("showClientInfo changed:", showClientInfo);
}, [showClientInfo]);

//   useEffect(() => {
//   console.log("this is the conncted client ", connectedAgent);
// }, [connectedAgent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    console.log("handle send message called")
    if (!input.trim() || !conversation) return;

    const newMessage: ChatMessage = {
      message: input,
      chatDirection: ChatDirection.FromAgentToClient,
      timestamp: new Date(), 
      chatEvent:ChatEvent.MessageFromAgentToClient,
      senderId:connectedAgent._id ,
      conversationId: conversation.AppClientID,
      appAgent: connectedAgent,
      isSentBy_BB:false,
      senderType:SenderType.AGENT,
      appClient:undefined,
      editedAt:undefined,
      messageRecations: undefined      
    };
    console.log("this is the full message : ", JSON.stringify(newMessage))
    socketRefAgent.current?.emit('add-message-agent', newMessage);

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage]
    };

    setConversation(updatedConversation);
    setConversations(conversations.map(conv => 
      conv.AppClientID === updatedConversation.AppClientID 
        ? updatedConversation 
        : conv
    ));

    setInput('');
    inputRef.current?.focus();
  };




  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setCallState('ringing');
    // Mock call logic here
    setTimeout(() => {
      setCallState('active');
    }, 2000);
  };

  const endCall = () => {
    setCallState('idle');
    setCallType(null);
    setIncomingCall(null);
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(timestamp);
  };

  const formatUsername = (username: string) => {
    return username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

 if (!conversation) {
    return (
      <div className="chat-container no-conversation">
        <div className="no-conversation-state">
          <div className="no-conversation-icon">💬</div>
          <h3>No conversation selected</h3>
          <p>Choose a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  } 

  return (
    <div className="chat-container">
      {/* Incoming Call Modal */}
      {callState === 'ringing' && incomingCall && (
        <div className="call-modal-overlay">
          <div className="call-modal">
            <div className="call-avatar">
              <img 
                src={`https://avatar.iran.liara.run/username?username=${conversation.AppClientID}`}
                alt={conversation.AppClientID}
              />
            </div>
            <h3>Incoming {incomingCall.type === 'video' ? 'Video' : 'Audio'} Call</h3>
            <p>From: {formatUsername(conversation.AppClientID)}</p>
            
            <div className="call-actions">
              <button className="call-button reject" onClick={endCall}>
                <PhoneCall size={24} />
              </button>
              <button className="call-button accept" onClick={() => setCallState('active')}>
                {incomingCall.type === 'video' ? <VideoIcon size={24} /> : <Phone size={24} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Overlay */}
      {callState === 'active' && callType === 'video' && (
        <div className="video-call-overlay">
          <div className="video-container">
            <video ref={userVideo} autoPlay playsInline className="remote-video" />
            <video ref={myVideo} autoPlay playsInline muted className="local-video" />
            
            <div className="video-controls">
              <button className="video-control-btn" onClick={endCall}>
                <PhoneCall size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <header className="chat-header">
        <div className="header-left">
          <button className="back-button">
            <ChevronLeft size={20} />
          </button>
          
          <div className="user-info">
            <div className="avatar-container">
              <img
                src={ `https://avatar.iran.liara.run/username?username=${conversation.AppClientID}`}
                alt={conversation.AppClientID}
                className="user-avatar"
              />
              <div className={`status-indicator ${callState === 'active' ? 'in-call' : 'online'}`}></div>
            </div>
            
            <div className="user-details">
              <h3 className="user-name">{formatUsername(conversation.AppClientID)}</h3>
              <p className="user-status">
                {callState === 'active' ? 'In Call' : 
                 callState === 'ringing' ? (incomingCall ? 'Incoming Call' : 'Calling...') : 
                  'Online'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className={`action-btn ${callState === 'active' && callType === 'audio' ? 'active' : ''}`}
            onClick={() => callState === 'idle' ? startCall('audio') : endCall()}
            disabled={!!incomingCall}
          >
            <Phone size={18} />
          </button>
          
          <button 
            className={`action-btn ${callState === 'active' && callType === 'video' ? 'active' : ''}`}
            onClick={() => callState === 'idle' ? startCall('video') : endCall()}
            disabled={!!incomingCall}
          >
            <Video size={18} />
          </button>
            <button 
            className="action-btn"
            onClick={() => setShowClientInfo(true)}
          >
            <Info size={18} />
            </button>
          
          <div className="dropdown-container">
            <button 
              className="action-btn"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
            >
              <MoreVertical size={18} />
            </button>
            
            {showMoreOptions && (
              <div className="dropdown-menu">
                <button className="dropdown-item">Mute notifications</button>
                <button className="dropdown-item">Clear chat</button>
                <button className="dropdown-item">Block user</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item danger">Report</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Client Info Modal or Panel */}
      {showClientInfo && (
        <div>
          <h1>we need to display client info </h1>
          <button onClick={() => setShowClientInfo(false)}> X </button>
        </div>

      )}

      {/* Chat Messages */}
      <div className="chat-messages">
        <div className="messages-container">
          {conversation.messages
            .filter(msg => msg.message && msg.message.trim() !== "")
            .map((msg , index) => {
              const isAgent = msg.chatDirection === ChatDirection.FromAgentToClient;
              return (
                <div
                  key={`msg-${index}`}
                  className={`message-wrapper ${isAgent ? "from-agent" : "from-client"}`}
                >
                  <div
                    className={`message-bubble ${isAgent ? "agent-bubble" : "client-bubble"}`}
                  >
                    <p className="message-text">{msg.message}</p>
                    <span className="message-time">
                      {msg.timestamp && !isNaN(new Date(msg.timestamp).getTime())
                        ? formatTime(new Date(msg.timestamp))
                        : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>


      {/* Chat Footer */}
      <footer className="chat-footer">
        <div className="footer-content">
          <div className="dropdown-container">
            <button 
              className="attachment-btn"
              onClick={() => setShowAttachments(!showAttachments)}
            >
              <Paperclip size={20} />
            </button>
            
            {showAttachments && (
              <div className="attachments-menu">
                <button className="attachment-item">
                  <div className="attachment-icon photo">
                    <Image size={16} />
                  </div>
                  <span>Photo or Video</span>
                </button>
                <button className="attachment-item">
                  <div className="attachment-icon document">
                    <FileText size={16} />
                  </div>
                  <span>Document</span>
                </button>
                <button className="attachment-item">
                  <div className="attachment-icon location">
                    <MapPin size={16} />
                  </div>
                  <span>Location</span>
                </button>
                <button className="attachment-item">
                  <div className="attachment-icon contact">
                    <Users size={16} />
                  </div>
                  <span>Contact</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              className="message-input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="send-button"
              onClick={handleSendMessage}
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          
          <button className="emoji-btn">
            <Smile size={20} />
          </button>
        </div>
      </footer>

      <style >{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #ffffff;
          position: relative;
        }

        .no-conversation {
          justify-content: center;
          align-items: center;
          background: #f8fafc;
        }

        .no-conversation-state {
          text-align: center;
          color: #64748b;
        }

        .no-conversation-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-conversation-state h3 {
          margin: 0 0 0.5rem 0;
          color: #334155;
          font-size: 1.5rem;
        }

        .no-conversation-state p {
          margin: 0;
          color: #64748b;
        }

        /* Call Modal Styles */
        .call-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .call-modal {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .call-avatar {
          margin-bottom: 1rem;
        }

        .call-avatar img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .call-modal h3 {
          margin: 0 0 0.5rem 0;
          color: #111827;
          font-size: 1.25rem;
        }

        .call-modal p {
          margin: 0 0 2rem 0;
          color: #6b7280;
        }

        .call-actions {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .call-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .call-button.reject {
          background: #ef4444;
          color: white;
        }

        .call-button.accept {
          background: #10b981;
          color: white;
        }

        .call-button:hover {
          transform: scale(1.1);
        }

        /* Video Call Styles */
        .video-call-overlay {
          position: fixed;
          inset: 0;
          background: #000;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .remote-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .local-video {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 200px;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid white;
        }

        .video-controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
        }

        .video-control-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: #ef4444;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .video-control-btn:hover {
          transform: scale(1.1);
        }

        /* Header Styles */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          min-height: 70px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 0;
        }

        .back-button {
          display: none;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: #f3f4f6;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #e5e7eb;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          background: #10b981;
        }

        .status-indicator.in-call {
          background: #3b82f6;
        }

        .user-details {
          min-width: 0;
        }

        .user-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-status {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: #f9fafb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
        }

        .action-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .action-btn.active {
          background: #3b82f6;
          color: white;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dropdown-container {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 100;
          padding: 0.5rem;
          margin-top: 0.25rem;
          min-width: 160px;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          text-align: left;
          border: none;
          background: none;
          color: #374151;
          border-radius: 4px;
          transition: background-color 0.2s;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .dropdown-item:hover {
          background: #f3f4f6;
        }

        .dropdown-item.danger {
          color: #ef4444;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0.5rem 0;
        }

        /* Messages Styles */
        .chat-messages {
          flex: 1;
          overflow: hidden;
          background: #f8fafc;
        }

        .messages-container {
          height: 100%;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .messages-container::-webkit-scrollbar {
          width: 4px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .message-wrapper {
          display: flex;
          align-items: flex-end;
        }

        .message-wrapper.sent {
          justify-content: flex-end;
        }

        .message-wrapper.received {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          position: relative;
          word-wrap: break-word;
        }

        .sent .message-bubble {
          background: #3b82f6;
          color: white;
          border-bottom-right-radius: 0.25rem;
        }

        .received .message-bubble {
          background: white;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 0.25rem;
        }

        .message-text {
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
        }

        .message-time {
          font-size: 0.75rem;
          opacity: 0.7;
          display: block;
        }

        /* Footer Styles */
        .chat-footer {
          padding: 1rem 1.5rem;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .footer-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .attachment-btn, .emoji-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: #f9fafb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
          flex-shrink: 0;
        }

        .attachment-btn:hover, .emoji-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .attachments-menu {
          position: absolute;
          bottom: 100%;
          left: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 100;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          min-width: 200px;
        }

        .attachment-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: left;
        }

        .attachment-item:hover {
          background: #f3f4f6;
        }

        .attachment-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .attachment-icon.photo {
          background: #ec4899;
        }

        .attachment-icon.document {
          background: #3b82f6;
        }

        .attachment-icon.location {
          background: #10b981;
        }

        .attachment-icon.contact {
          background: #8b5cf6;
        }

        .input-container {
          flex: 1;
          display: flex;
          align-items: center;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }

        .input-container:focus-within {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .message-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 0.875rem;
          color: #111827;
          min-height: 20px;
          resize: none;
        }

        .message-input::placeholder {
          color: #9ca3af;
        }

        .send-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: 0.5rem;
        }

        .send-button:hover:not(:disabled) {
          background: #2563eb;
          transform: scale(1.05);
        }

        .send-button:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .back-button {
            display: flex;
          }

          .chat-header {
            padding: 0.75rem 1rem;
          }

          .user-name {
            font-size: 0.875rem;
          }

          .user-status {
            font-size: 0.75rem;
          }

          .header-actions {
            gap: 0.25rem;
          }

          .action-btn {
            width: 32px;
            height: 32px;
          }

          .messages-container {
            padding: 0.75rem;
          }

          .message-bubble {
            max-width: 85%;
            padding: 0.5rem 0.75rem;
          }

          .chat-footer {
            padding: 0.75rem 1rem;
          }

          .footer-content {
            gap: 0.5rem;
          }

          .attachment-btn, .emoji-btn {
            width: 36px;
            height: 36px;
          }

          .local-video {
            width: 120px;
            height: 90px;
            bottom: 10px;
            right: 10px;
          }

          .call-modal {
            padding: 1.5rem;
          }

          .call-avatar img {
            width: 60px;
            height: 60px;
          }

          .call-button {
            width: 50px;
            height: 50px;
          }
        }

        @media (max-width: 480px) {
          .message-bubble {
            max-width: 90%;
          }

          .attachments-menu {
            min-width: 180px;
          }

          .attachment-item {
            padding: 0.5rem;
          }

          .attachment-icon {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}