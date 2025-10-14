import { useEffect, useState } from 'react'
import { Search, Settings, Plus, MoreHorizontal, MessageSquare, Users, Archive, Star, UserCheck, ToggleRight, User, ChevronDown, Clock, Check, CheckCheck } from 'lucide-react'
import conversationService from '@/services/Conversation/conversationService'
import { AppAgent } from '@/models/AppAgent';
import AgentType from '@/models/AgentType';
import { Conversation } from '@/models/Conversation';
import { useConversation } from '@/context/ConversationContext';

export default function ChatLeftSide() {
  const [search, setSearch] = useState('')
  const [selectedAppClientID, setSelectedAppClientID] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all')
  const { conversations, convo, setConversations, setConvo, connectedAgent, setConnectedAgent } = useConversation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-container')) {
        setShowDropdown(false)
        setShowSettingsDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const filteredConversations = (conversations || []).filter((conversation) =>
    conversation.AppClientID.toLowerCase().includes(search.toLowerCase())
  )

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedAppClientID(conversation.AppClientID)
    setConvo(conversation)
    console.log("this is the convo  : ", convo);
    console.log("this is the conversation  : ", conversation);
    console.log('Joining conversation:', conversation.AppClientID)
  }

  const formatUsername = (username: string) => {
    return username.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getTimeAgo = (lastActive?: string) => {
    if (!lastActive) return 'just now'
    const date = new Date(lastActive)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    
    if (diffInMins < 1) return 'just now'
    if (diffInMins < 60) return `${diffInMins}m ago`
    if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`
    return `${Math.floor(diffInMins / 1440)}d ago`
  }

  const getInitials = (name: string) => {
    return name.split('_').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="chat-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="header-top">
          <div className="dropdown-container">
            <button 
              className="title-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <h1>Messages</h1>
              <ChevronDown className={`dropdown-arrow ${showDropdown ? 'rotated' : ''}`} size={20} />
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu animate-in">
                <button className="dropdown-item">
                  <MessageSquare size={18} />
                  <span>All Chats</span>
                  <span className="count-badge">{conversations?.length || 0}</span>
                </button>
                <button className="dropdown-item">
                  <User size={18} />
                  <span>Contacts</span>
                </button>
                <button className="dropdown-item">
                  <Users size={18} />
                  <span>Groups</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">
                  <Archive size={18} />
                  <span>Archived</span>
                </button>
                <button className="dropdown-item">
                  <Star size={18} />
                  <span>Favorites</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="header-actions">
            <button className="action-button" title="New conversation">
              <Plus size={20} />
            </button>
            
            <div className="dropdown-container">
              <button 
                className="action-button"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                title="More options"
              >
                <Settings size={20} />
              </button>
              
              {showSettingsDropdown && (
                <div className="dropdown-menu dropdown-right animate-in">
                  <button className="dropdown-item">
                    <UserCheck size={18} />
                    <span>Active Contacts</span>
                  </button>
                  <button className="dropdown-item">
                    <MessageSquare size={18} />
                    <span>Chat Requests</span>
                  </button>
                  <button className="dropdown-item">
                    <Archive size={18} />
                    <span>Archived Chats</span>
                  </button>
                  <button className="dropdown-item">
                    <ToggleRight size={18} />
                    <span>Unread Chats</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item">Settings</button>
                  <button className="dropdown-item">Help</button>
                  <button className="dropdown-item text-danger">Report a problem</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
            {/* <span className="tab-badge">3</span> */}
          </button>
          <button 
            className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived
          </button>
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
          {search && (
            <button 
              className="clear-search"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="conversations-container">
        <div className="conversations-list">
          {filteredConversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <MessageSquare size={48} />
              </div>
              <h3>No conversations found</h3>
              <p>{search ? 'Try a different search term' : 'Start a new conversation'}</p>
              {!search && (
                <button className="empty-action">
                  <Plus size={18} />
                  New Conversation
                </button>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isSelected = selectedAppClientID === conversation.AppClientID
              const hasUnread = false // conversation.unreadCount > 0
              const lastMessage = conversation.messages.length > 0 
                ? conversation.messages[conversation.messages.length - 1].message 
                : 'No messages yet'

              return (
                <div
                  key={conversation.AppClientID}
                  className={`conversation-item ${isSelected ? 'selected' : ''} ${hasUnread ? 'unread' : ''}`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="avatar-container">
                    <img
                      src={`https://avatar.iran.liara.run/username?username=${conversation.AppClientID}`}
                      alt={conversation.AppClientID}
                      className="avatar"
                    />
                    <div className="status-indicator online"></div>
                  </div>
                  
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <div className="user-info">
                        <span className="username">
                          {formatUsername(conversation.AppClientID)}
                        </span>
                        {conversation.isHandledBy_BB && (
                          <span className="badge bot-badge">
                            <span className="badge-dot"></span>
                            BaseBuddy
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="last-message-wrapper">
                      <div className="last-message">
                        <CheckCheck size={14} className="message-status" />
                        {lastMessage}
                      </div>
                      {hasUnread && (
                        <span className="unread-badge">3</span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className="more-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle more actions
                    }}
                  >
                    <MoreHorizontal size={18} />
                  </button>
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
          width: 360px;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          overflow: hidden;
        }

        /* Header Styles */
        .sidebar-header {
          background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
          border-bottom: 1px solid #e5e7eb;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 16px;
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
          padding: 8px 12px;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .title-button:hover {
          background: #f3f4f6;
        }

        .title-button h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dropdown-arrow {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #6b7280;
        }

        .dropdown-arrow.rotated {
          transform: rotate(180deg);
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          background: #f3f4f6;
          color: #6b7280;
        }

        .action-button:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          z-index: 1000;
          padding: 8px;
          min-width: 220px;
          max-width: 280px;
        }

        .dropdown-right {
          left: auto;
          right: 0;
        }

        .animate-in {
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: #374151;
          border-radius: 10px;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          border: none;
          background: none;
          width: 100%;
          cursor: pointer;
          text-align: left;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          color: #667eea;
        }

        .dropdown-item.text-danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .count-badge {
          margin-left: auto;
          background: #e5e7eb;
          color: #6b7280;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 8px 0;
        }

        /* Tabs */
        .tabs-container {
          display: flex;
          padding: 0 20px 16px;
          gap: 8px;
        }

        .tab {
          flex: 1;
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .tab:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .tab-badge {
          background: rgba(255, 255, 255, 0.3);
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
        }

        /* Search */
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
          left: 14px;
          color: #9ca3af;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px 12px 44px;
          border: 2px solid #e5e7eb;
          border-radius: 14px;
          font-size: 14px;
          background: #f9fafb;
          transition: all 0.2s;
          font-weight: 500;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .clear-search {
          position: absolute;
          right: 12px;
          background: #e5e7eb;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          color: #6b7280;
          transition: all 0.2s;
        }

        .clear-search:hover {
          background: #d1d5db;
          color: #374151;
        }

        /* Conversations List */
        .conversations-container {
          flex: 1;
          overflow: hidden;
          background: white;
        }

        .conversations-list {
          height: 100%;
          overflow-y: auto;
          padding: 8px 12px;
        }

        .conversations-list::-webkit-scrollbar {
          width: 6px;
        }

        .conversations-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .conversations-list::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .conversations-list::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }

        /* Conversation Item */
        .conversation-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
          position: relative;
          border: 2px solid transparent;
        }

        .conversation-item:hover {
          background: #f8fafc;
          transform: translateX(4px);
        }

        .conversation-item.selected {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
          border-color: rgba(102, 126, 234, 0.3);
        }

        .conversation-item.unread {
          background: #eff6ff;
        }

        .avatar-container {
          position: relative;
          flex-shrink: 0;
        }

        .avatar {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          object-fit: cover;
          border: 2px solid #f3f4f6;
          transition: all 0.2s;
        }

        .conversation-item.selected .avatar {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 14px;
          height: 14px;
          border: 3px solid white;
          border-radius: 50%;
          background: #d1d5db;
        }

        .status-indicator.online {
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .conversation-content {
          flex: 1;
          min-width: 0;
        }

        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
          flex: 1;
        }

        .username {
          font-weight: 600;
          color: #111827;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          padding: 3px 8px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .bot-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          color: #9ca3af;
        }

        .time {
          font-size: 12px;
          font-weight: 500;
        }

        .last-message-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: space-between;
        }

        .last-message {
          color: #6b7280;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .message-status {
          color: #10b981;
          flex-shrink: 0;
        }

        .unread-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .more-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          color: #9ca3af;
          transition: all 0.2s;
          opacity: 0;
          flex-shrink: 0;
        }

        .conversation-item:hover .more-button {
          opacity: 1;
        }

        .more-button:hover {
          background: #f3f4f6;
          color: #667eea;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 300px;
          padding: 40px 20px;
          text-align: center;
        }

        .empty-icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: #667eea;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .empty-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .empty-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 100%;
            max-width: 100vw;
          }

          .header-top {
            padding: 16px 16px 12px;
          }

          .title-button h1 {
            font-size: 20px;
          }

          .search-container {
            padding: 12px 16px;
          }

          .conversations-list {
            padding: 4px 8px;
          }

          .conversation-item {
            padding: 10px 12px;
          }

          .avatar {
            width: 46px;
            height: 46px;
          }

          .last-message {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}