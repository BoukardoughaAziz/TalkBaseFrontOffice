import { useEffect, useState } from 'react'
import { Search, Settings, Plus, MoreHorizontal, MessageSquare, Users, Archive, Star, UserCheck, ToggleRight, User } from 'lucide-react'
import conversationService from '@/services/Conversation/conversationService'
import { AppAgent } from '@/models/AppAgent';

// Mock interfaces for the demo
interface Message {
  message: string;
  timestamp?: string;
}

interface Conversation {
  AppClientID: string;
  messages: Message[];
  isHandledBy_BB?: boolean;
  lastActive?: string;
  unreadCount?: number;
}

interface ChatLeftSideProps {
  connectedAgent: AppAgent | null;
}

export default function ChatLeftSide({ connectedAgent }: ChatLeftSideProps) {
  const [search, setSearch] = useState('')
  const [selectedAppClientID, setSelectedAppClientID] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  // initialize to mock data (or use [] to start empty and fetch real data in useEffect)
  const [conversations, setConversations] = useState<Conversation[]>();
  const [conversation, setConversation] = useState<Conversation | null>(null);


  useEffect(() => {
    console.log("chat left side was mounted")
    console.log("this is the connected agent id from the chat left side : ", connectedAgent._id)
    conversationService.getConversationsByAgentId(connectedAgent?._id)
            .then(conversations => {
              setConversations(conversations);
              console.log("Fetched conversations for agent:", conversations);
            })
            .catch(error => {
              console.error("Error fetching conversations:", error);
            });
}, []);



  
  // safe filter in case conversations is ever undefined
  const filteredConversations = (conversations || []).filter((conversation) =>
    conversation.AppClientID.toLowerCase().includes(search.toLowerCase())
  )


  const handleConversationClick = (conversation: Conversation) => {
    setSelectedAppClientID(conversation.AppClientID)
    setConversation(conversation)
    console.log('Joining conversation:', conversation.AppClientID)
  }

  const formatUsername = (username: string) => {
    return username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getTimeAgo = (lastActive?: string) => {
    return lastActive || 'just now'
  }

  return (
    <div className="chat-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="header-content">
          <div className="dropdown-container">
            <button 
              className="title-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <h1>Chat</h1>
              <svg className="dropdown-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#"><MessageSquare size={16} /><span>Chats</span></a>
                <a className="dropdown-item" href="#"><User size={16} /><span>Contacts</span></a>
                <a className="dropdown-item" href="#"><Users size={16} /><span>Groups</span></a>
                <a className="dropdown-item" href="#"><Archive size={16} /><span>Archived</span></a>
                <a className="dropdown-item" href="#"><Star size={16} /><span>Favorites</span></a>
              </div>
            )}
          </div>
          
          <div className="header-actions">
            <div className="dropdown-container">
              <button 
                className="action-button"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              >
                <Settings size={18} />
              </button>
              
              {showSettingsDropdown && (
                <div className="dropdown-menu dropdown-right">
                  <a className="dropdown-item" href="#"><UserCheck size={16} /><span>Active Contacts</span></a>
                  <a className="dropdown-item" href="#"><MessageSquare size={16} /><span>Chat Requests</span></a>
                  <a className="dropdown-item" href="#"><Archive size={16} /><span>Archived Chats</span></a>
                  <a className="dropdown-item" href="#"><ToggleRight size={16} /><span>Unread Chats</span></a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#">Settings</a>
                  <a className="dropdown-item" href="#">Help</a>
                  <a className="dropdown-item" href="#">Report a problem</a>
                </div>
              )}
            </div>
            
            <button className="action-button primary">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="conversations-container">
        <div className="conversations-list">
          {filteredConversations.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={48} className="empty-icon" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isSelected = selectedAppClientID === conversation.AppClientID
              const hasUnread = (conversation.unreadCount || 0) > 0

              return (
                <div
                  key={conversation.AppClientID}
                  className={`conversation-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="avatar-container">
                    <img
                      src={`https://avatar.iran.liara.run/username?username=${conversation.AppClientID}`}
                      alt={conversation.AppClientID}
                      className="avatar"
                    />
                    <div className="online-indicator"></div>
                  </div>
                  
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <div className="user-info">
                        <span className="username">
                          {formatUsername(conversation.AppClientID)}
                        </span>
                        {conversation.isHandledBy_BB && (
                          <span className="bot-badge">BaseBuddy</span>
                        )}
                      </div>
                      <div className="meta-info">
                        <span className="time">{getTimeAgo(conversation.lastActive)}</span>
                        {hasUnread && (
                          <span className="unread-badge">{conversation.unreadCount}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="last-message">
                      {conversation.messages.length > 0
                        ? conversation.messages[conversation.messages.length - 1].message
                        : 'No messages yet'}
                    </div>
                  </div>
                  
                  <div className="conversation-actions">
                    <button className="more-button">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <style>{`
        .chat-sidebar {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 320px;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #f3f4f6;
          background: #fafafa;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dropdown-container {
          position: relative;
        }

        .title-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .title-button:hover {
          background: #f3f4f6;
        }

        .title-button h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .dropdown-arrow {
          transition: transform 0.2s;
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background: #f9fafb;
          color: #6b7280;
        }

        .action-button:hover {
          background: #f3f4f6;
          color: #374151;
          transform: translateY(-1px);
        }

        .action-button.primary {
          background: #3b82f6;
          color: white;
        }

        .action-button.primary:hover {
          background: #2563eb;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: 8px;
          margin-top: 4px;
          min-width: 200px;
        }

        .dropdown-right {
          left: auto;
          right: 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: #374151;
          border-radius: 8px;
          transition: background-color 0.2s;
          font-size: 14px;
        }

        .dropdown-item:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 8px 0;
        }

        .search-container {
          padding: 16px 20px;
          background: white;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #9ca3af;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          background: #f9fafb;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .conversations-container {
          flex: 1;
          overflow: hidden;
          background: white;
        }

        .conversations-list {
          height: 100%;
          overflow-y: auto;
          padding: 8px;
        }

        .conversations-list::-webkit-scrollbar {
          width: 4px;
        }

        .conversations-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .conversations-list::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .conversations-list::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .conversation-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
          position: relative;
        }

        .conversation-item:hover {
          background: #f8fafc;
        }

        .conversation-item.selected {
          background: #eff6ff;
          border: 1px solid #dbeafe;
        }

        .avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .conversation-content {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .username {
          font-weight: 600;
          color: #111827;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bot-badge {
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          white-space: nowrap;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .time {
          font-size: 12px;
          color: #6b7280;
        }

        .unread-badge {
          background: #ef4444;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
          min-width: 18px;
          text-align: center;
        }

        .last-message {
          color: #6b7280;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }

        .conversation-actions {
          flex-shrink: 0;
        }

        .more-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          color: #9ca3af;
          transition: all 0.2s;
          opacity: 0;
        }

        .conversation-item:hover .more-button {
          opacity: 1;
        }

        .more-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #9ca3af;
          text-align: center;
        }

        .empty-icon {
          margin-bottom: 16px;
          color: #d1d5db;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 100%;
            max-width: 100vw;
          }

          .sidebar-header {
            padding: 16px;
          }

          .title-button h1 {
            font-size: 20px;
          }

          .search-container {
            padding: 12px 16px;
          }

          .conversations-list {
            padding: 4px;
          }

          .conversation-item {
            padding: 12px;
          }

          .avatar {
            width: 40px;
            height: 40px;
          }

          .last-message {
            max-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .conversation-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .meta-info {
            align-self: flex-end;
          }

          .last-message {
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  )
}