import { AppAgent } from "@/models/AppAgent";
import { Conversation } from "@/models/Conversation";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import conversationService from "@/services/Conversation/conversationService";
import AgentType from "@/models/AgentType";
import { ClientInformation } from "@/models/ClientInformation";

interface ConversationContextType {
  user: AppAgent | null;
  token: string | null;
  conversations: Conversation[];
  convo: Conversation | undefined;
  connectedAgent: AppAgent | null;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setConvo: React.Dispatch<React.SetStateAction<Conversation | undefined>>;
  setConnectedAgent: React.Dispatch<React.SetStateAction<AppAgent | null>>;
  showClientInfo: boolean;
  clientInformation: ClientInformation | undefined;
  setClientInformation: React.Dispatch<React.SetStateAction<ClientInformation | undefined>>;
  setShowClientInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppAgent | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convo, setConvo] = useState<Conversation>();
  const [connectedAgent, setConnectedAgent] = useState<AppAgent | null>(null);
  const [clientInformation, setClientInformation] = useState<ClientInformation>();
  const [showClientInfo, setShowClientInfo] = useState<boolean>(false);
// Initialize from cookies on first mount
useEffect(() => {
    
  const params = new URLSearchParams(window.location.search);
  if (params.toString()) {
    console.log("if part")
    console.log("URL params found:", params.toString());
    const accessToken = params.get("token");
    const email = params.get("email");
    const firstname = params.get("firstname");
    const lastname = params.get("lastname");
    const typeParam = params.get("type");
    let type: AgentType;
    if (typeParam === "AGENT") {
      type = AgentType.Agent;
    } else {
      type = AgentType.Admin;
    }
    const id = params.get("id");

    if (accessToken && email && firstname && lastname && type && id) {
      const agent: AppAgent = {
      _id: id,
      email,
      firstname,
      lastname,
      type,
      emailPin:55,
      emailVerified: true,
      isApproved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      password: "hidden", // Password should not be set from URL params
      Conversations:[],
      SocketId: "",
      };
      setConnectedAgent(agent);
      setToken(accessToken);

      Cookies.set("user", JSON.stringify(agent));
      Cookies.set("accessToken", accessToken);
    } 

    const url = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, url);
  }else {
      console.log("else part")
      // Fetch user and access token from cookies if available
      const cookieUser = Cookies.get("user");
      const cookieToken = Cookies.get("accessToken");
      console.log("------------------------------------------")
      console.log("------------------------------------------")
      console.log("this is the cookie user", cookieUser);
      console.log("this is the cookie token", cookieToken);
      console.log("------------------------------------------")
      console.log("------------------------------------------")
      if (cookieUser && cookieToken) {
      try {
        const parsedUser: AppAgent = JSON.parse(cookieUser);
        setConnectedAgent(parsedUser);
        setToken(cookieToken);
      } catch (e) {
        console.error("Failed to parse user from cookie:", e);
      }
      }
    }

  const cookieUser = Cookies.get("user");
  const cookieToken = Cookies.get("accessToken");
  console.log("this is the cookie user", cookieUser);
  console.log("this is the cookie token", cookieToken);
      
}, []);

// Add a separate useEffect to log when connectedAgent changes
useEffect(() => {
  console.log("Connected agent updated:", connectedAgent);
  console.log("Access token updated:", token);
  
  // Now you can safely use connectedAgent here
  if (connectedAgent?._id) {
    conversationService.getConversationsByAgentId(connectedAgent._id)
      .then((conversations) => {
        setConversations(conversations);
        console.log("Fetched conversations for agent:", conversations);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      });
  }
}, [connectedAgent, token]); // This runs whenever connectedAgent or token changes

  return (
    <ConversationContext.Provider
      value={{
        user,
        token,
        conversations,
        convo,
        connectedAgent,
        setConversations,
        setConvo,
        setConnectedAgent,
        showClientInfo,
        setClientInformation,
        setShowClientInfo,
        clientInformation
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook for easy access
export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) throw new Error("useConversation must be used within a ConversationProvider");
  return context;
};
