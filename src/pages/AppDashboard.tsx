import { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { ALL_COMPONENTS } from '@/App'
import routesConfig from '@/RoutesConfig'
import feather from 'feather-icons'
import NavItem from './NavItem'
import Chat from './chats/Chat'
import Sidebar from './statisticsDashboard/Sidebar'
import ChatLeftSide from './chats/ChatLeftSide'
import { AppAgent } from '@/models/AppAgent'
import conversationService from '@/services/Conversation/conversationService'
import { Conversation } from '@/models/Conversation'
import { User } from 'lucide-react'
import ChatConversation from './chats/ChatConversation'
import { ClientInformation } from '@/models/ClientInformation'
import ClientInformationUI from './ClinetInformation/ClientInformationUI'
import { io, Socket } from 'socket.io-client';

export default function AppDashboard() {
  const [activeComponent, setActiveComponent] = useState('Chat')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [connectedAgent, setConnectedAgent] = useState<AppAgent | null>(null);
  
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convo, setConvo] = useState<Conversation>();
  const [clientInformation, setClientInformation] = useState<ClientInformation>();
  const [showClientInfo, setShowClientInfo] = useState<boolean>(false);

  const socketRefClient = useRef<Socket | null>(null);
  const socketRefAgent = useRef<Socket | null>(null);

    useEffect(() => {
      console.log("AppDashboard mounted");
      const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [key, value] = current.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const userJson = cookies['user'];
      if (userJson) {
        const user = JSON.parse(decodeURIComponent(userJson));
        setConnectedAgent(user);
        console.log("Connected agent ", connectedAgent);
      }
    }, []);



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


  socketRefClient.current?.on('AConversationWillBeHandledByAgent', (conversationId) => {
    console.log("No More AI For This Conversation",conversationId)
  })
  socketRefClient.current?.on('ConversationStarted', (NewConversation,AppAgentID) => {
    console.log("*************************************************")
    console.log("A New Conversation Was Added",NewConversation)
    console.log("This is the Agent handeling it",AppAgentID)
    console.log("*************************************************")
  })


useEffect(() => {
  const cookies = document.cookie.split('; ').reduce((acc, current) => {
    const [key, value] = current.split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const userJson = cookies['user'];
  if (userJson) {
    const user = JSON.parse(decodeURIComponent(userJson));
    setConnectedAgent(user);
  }
}, []);

useEffect(() => {
  if (connectedAgent?._id) {
    conversationService.getConversationsByAgentId(connectedAgent._id)
      .then(conversations => {
        setConversations(conversations);
      })
      .catch(error => {
        console.error("Error fetching conversations:", error);
      });
  }
}, [connectedAgent]);


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Determine if sidebar should show full content
  const shouldShowFullContent = !isCollapsed || isHovered

  return (
    <div className='hk-wrapper'>
      <div className={`hk-pg-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
          <ChatLeftSide/> 
      </div>


            <div className={`hk-pg-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>

          <ChatConversation
            conversation={convo}
            setConversation={setConvo}
            conversations={conversations}
            setConversations={setConversations}
            ClientInformation={clientInformation}
            setClientInformation={setClientInformation}
            setConnectedAgent={setConnectedAgent}
            connectedAgent={connectedAgent}
          /> 
              
      </div>

      <style>{`
        .hk-wrapper {
          display: flex;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #f8fafc;
        }
        
        .hk-pg-wrapper {
          flex: 1;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
        }
        
        /* Remove all padding/margins from chat component */
        .hk-pg-wrapper > * {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
        }
        
        /* Make navigation icons bigger */
        .nav-item .icon,
        .nav-item svg,
        .nav-item i {
          width: 24px !important;
          height: 24px !important;
          font-size: 24px !important;
        }
        
        /* Make toggle button icons bigger */
        .navbar-toggle .icon svg {
          width: 28px !important;
          height: 28px !important;
        }
        
        /* Feather icons size adjustment */
        .nav-item [data-feather] {
          width: 24px !important;
          height: 24px !important;
          stroke-width: 1.5 !important;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .hk-wrapper {
            flex-direction: row;
          }
          
          .hk-pg-wrapper {
            height: 100vh;
          }
        }
      `}</style>
    </div>
  )
}