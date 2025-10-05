// import { useEffect, useState } from "react";
// import axios from "axios";
// import AppStack from "./AppStack";
// import ChatDirection from "@/models/ChatDirection";
// import ChatEvent from "@/models/ChatEvent";
// import { AppMap } from "@/components/AppMap";
// import conversationService from "@/services/Conversation/conversationService";
// import { ClientInformation } from "@/models/ClientInformation";
// import { ChatMessage } from "@/models/ChatMessage";
// import { Conversation } from "@/models/Conversation";
// import { AppClient } from "@/models/AppClient";
// import AppOS from "@/models/AppOS";
// import { useWebSocket } from "@/context/WebSocketProvider";
// import { Socket } from "socket.io-client";

// interface ChatFooterProps {
//   conversation: AppMap;
//   selectedAppClient: any;
//   setConversation: (conversation: AppMap) => void;
//   ClientInformation: ClientInformation;
//   convo: Conversation;
//   setConvo: (conversation: Conversation) => void;  
// }

// export default function ChatFooter({
//   conversation,
//   selectedAppClient,
//   setConversation,
//   ClientInformation,
//   convo,
// }: ChatFooterProps) {
//   const [input, setInput] = useState("");
//   const [message, setMessage] = useState<ChatMessage>();
//   const [AppAgent, setAppAgent] = useState<AppClient>();
//   const socket: Socket = useWebSocket();


//   useEffect(() => {
//     if (socket && convo?.AppClientID) {
//       socket.emit('joinConversation-agent', { ConversationId: convo.AppClientID });
//     }
//   }, [socket, convo?.AppClientID]);

//   useEffect(() => {
//     if (socket) {
//       socket.on('MESSAGE_FROM_AGENT_TO_CLIENT', (incomingMessage: ChatMessage) => {
//         console.log('Received message:', incomingMessage);
//         setConversation((prevConversation) => {
//           const updatedConversation = { ...prevConversation };
//           if (incomingMessage.conversationId) {
//             if (!updatedConversation[incomingMessage.conversationId]) {
//               updatedConversation[incomingMessage.conversationId] = [];
//             }
//             updatedConversation[incomingMessage.conversationId].push(incomingMessage);
//           }
//           return updatedConversation;
//         });
//       });
      
//       socket.on('MESSAGE_FROM_CLIENT_TO_AGENT', (incomingMessage: ChatMessage) => {
//         console.log('Received message:', incomingMessage);
//         setConversation((prevConversation) => {
//           const updatedConversation = { ...prevConversation };
//           if (incomingMessage.conversationId) {
//             if (!updatedConversation[incomingMessage.conversationId]) {
//               updatedConversation[incomingMessage.conversationId] = [];
//             }
//             updatedConversation[incomingMessage.conversationId].push(incomingMessage);
//           }
//           return updatedConversation;
//         });
//       });


//     }
  
//     return () => {
//       // socket.off('messageFromAgentToClient');
//     };
//   }, [socket]);
  

//   useEffect(() => {
//     setAppAgent({
//       identifier: conversation.AppClientID,
//       humanIdentifier: conversation.AppClientID,
//       appOS: AppOS.Win,
//       appBrowser: AppBrowser.Edge,
//       ipAddress: "192.168.1.1",
//       city: "Mock City",
//       org: "Mock Organization",
//       countryCode: "MC",
//       associatedAgent: {
//         identifier: "mock-associated-agent-id",
//         humanIdentifier: "mock-associated-human-identifier",
//         appOS: { name: "mock-associated-os", version: "2.0.0" },
//         appBrowser: { name: "mock-associated-browser", version: "2.0.0" },
//         ipAddress: "192.168.1.2",
//         city: "Mock Associated City",
//         org: "Mock Associated Organization",
//         countryCode: "MA",
        
//       },
//     });
//   }, [conversation]);

//   const handleSendChatMessage = () => {
//     if (!input.trim()) return; 
//     const chatMessage: ChatMessage = {
//       message: input,
//       timestamp: new Date(),
//       identifier: convo.AppClientID,
//       conversationId: convo.AppClientID,
//       chatDirection: ChatDirection.FromAgentToCLient,
//       appClient: AppAgent,
//       chatEvent: ChatEvent.MessageFromAgentToClient,
//     };
  
//     socket.emit('add-message-agent', chatMessage);
//     setInput('');
//   };
//   return (
//     <>
//       <footer className="chat-footer">
//         <button
//           className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover flex-shrink-0"
//           data-bs-toggle="dropdown"
//           aria-haspopup="true"
//           aria-expanded="false"
//         >
//           <span className="icon">
//             <span className="feather-icon">
//               <i data-feather="share"></i>
//             </span>
//           </span>
//         </button>
//         <div className="dropdown-menu">
//           <a className="dropdown-item" href="#">
//             <div className="d-flex align-items-center">
//               <div className="avatar avatar-icon avatar-xs avatar-soft-primary avatar-rounded me-3">
//                 <span className="initial-wrap">
//                   <i className="ri-image-line"></i>
//                 </span>
//               </div>
//               <div>
//                 <span className="h6 mb-0">Photo or Video Library</span>
//               </div>
//             </div>
//           </a>
//           <a className="dropdown-item" href="#">
//             <div className="d-flex align-items-center">
//               <div className="avatar avatar-icon avatar-xs avatar-soft-info avatar-rounded me-3">
//                 <span className="initial-wrap">
//                   <i className="ri-file-4-line"></i>
//                 </span>
//               </div>
//               <div>
//                 <span className="h6 mb-0">Documents</span>
//               </div>
//             </div>
//           </a>
//           <a className="dropdown-item" href="#">
//             <div className="d-flex align-items-center">
//               <div className="avatar avatar-icon avatar-xs avatar-soft-success avatar-rounded me-3">
//                 <span className="initial-wrap">
//                   <i className="ri-map-pin-line"></i>
//                 </span>
//               </div>
//               <div>
//                 <span className="h6 mb-0">Location</span>
//               </div>
//             </div>
//           </a>
//           <a className="dropdown-item" href="#">
//             <div className="d-flex align-items-center">
//               <div className="avatar avatar-icon avatar-xs avatar-soft-blue avatar-rounded me-3">
//                 <span className="initial-wrap">
//                   <i className="ri-contacts-line"></i>
//                 </span>
//               </div>
//               <div>
//                 <span className="h6 mb-0">Contact</span>
//               </div>
//             </div>
//           </a>
//         </div>
//         <div className="input-group">
//           <span className="input-affix-wrapper">
//             <input
//               type="text"
//               id="input_msg_send_chatapp"
//               name="send-msg"
//               className="input-msg-send form-control rounded-input"
//               placeholder="Type your message..."
//               onChange={(e) => setInput(e.target.value)}
//               value={input}
//               onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
//             />
//             <span className="input-suffix">
//               <button
//                 className="btn btn-icon btn-flush-primary btn-rounded btn-send"
//                 onClick={handleSendChatMessage}
//               >
//                 <span className="icon">
//                   <span className="feather-icon">
//                     <i data-feather="arrow-right"></i>
//                   </span>
//                 </span>
//               </button>
//             </span>
//           </span>
//         </div>
//         <button className="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover">
//           <span className="icon">
//             <span className="feather-icon">
//               <i data-feather="smile"></i>
//             </span>
//           </span>
//         </button>
//       </footer>
//     </>
//   );
// }