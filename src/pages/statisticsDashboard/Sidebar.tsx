import { useEffect, useState } from 'react'
import { 
  Menu, 
  X, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  User, 
  Home, 
  FileText, 
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { AppAgent } from '@/models/AppAgent';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import conversationService from '@/services/Conversation/conversationService';
import { Conversation } from '@/models/Conversation';
import Cookies from 'js-cookie';
import { useConversation } from '@/context/ConversationContext';

interface SidebarProps {
  isCollapsed?: boolean;
  isHovered?: boolean;
  toggleSidebar?: () => void;
  setIsHovered?: (hovered: boolean) => void;
  connectedAgent?: AppAgent | null;
}

export default function Sidebar({ 
  isCollapsed: propCollapsed,
  isHovered: propHovered,
  toggleSidebar: propToggleSidebar,
  setIsHovered: propSetIsHovered 
}: SidebarProps = {}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [internalHovered, setInternalHovered] = useState(false)
  const [activeItem, setActiveItem] = useState('Chat')
  
  const navigate = useNavigate();

  // Use props if provided, otherwise use internal state
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed
  const isHovered = propHovered !== undefined ? propHovered : internalHovered
  const toggleSidebar = propToggleSidebar || (() => setInternalCollapsed(!internalCollapsed))
  const setIsHovered = propSetIsHovered || setInternalHovered

  const navigationItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: Home, path: '/AppDashboard' },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' }
  ]

  const shouldShowFullContent = !isCollapsed || isHovered
  const location = useLocation();
  const { conversations, convo, setConversations, setConvo, connectedAgent, setConnectedAgent } = useConversation();

  const handleLogout = () => {
    // Clear all cookies
    Cookies.remove('user');
    Cookies.remove('accessToken');
    // Remove all cookies
    Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));

    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reset context state
    setConnectedAgent(null);
    setConversations([]);
    setConvo(null);
    
    // Redirect to login page
    navigate('/sign-in');
  };

  return (
    <>
      <div 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-section">
            {shouldShowFullContent ? (
              <div className="logo-full">
                <div className="logo-icon">
                  <img src='https://res.cloudinary.com/derpsow86/image/upload/v1760315195/TalkBase-Logo-NO-BG_cloahh.png' height={50} width={50} />
                </div>
                <span className="logo-text">TalkBase</span>
              </div>
            ) : (
              <div className="logo-collapsed">
                  <img src='https://res.cloudinary.com/derpsow86/image/upload/v1760315197/TalkBase-Logo_ypyoja.png' height={50} width={50} />
              </div>
            )}
          </div>
          
          {shouldShowFullContent && (
            <button 
              className="toggle-btn"
              onClick={toggleSidebar}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="navigation">
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.id}>
                  <Link to={item.path}>
                    <button
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      title={!shouldShowFullContent ? item.label : ''}
                    >
                      <div className="nav-icon">
                        <IconComponent size={20} />
                        {item.icon && <span className="badge">{item.label}</span>}
                      </div>
                      {shouldShowFullContent && (
                        <span className={`nav-label ${shouldShowFullContent ? 'visible' : 'hidden'}`}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="user-section">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={shouldShowFullContent ? 20 : 16} />
            </div>
              {connectedAgent && (
                <div className={`user-info ${shouldShowFullContent ? 'visible' : 'hidden'}`}>
                  <div className="user-name">{connectedAgent.firstname + ' ' + connectedAgent.lastname}</div>
                  <div className="user-role">{connectedAgent.type}</div>
                </div>
              )}
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-right: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: 85px;
        }

        .sidebar.collapsed:hover {
          width: 280px;
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.2);
        }

        .sidebar-header {
          padding: 20px 16px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 80px;
        }

        .logo-section {
          flex: 1;
        }

        .logo-full {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-collapsed {
          display: flex;
          justify-content: center;
          color: #667eea;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.5px;
        }

        .toggle-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: #e2e8f0;
          color: #475569;
        }

        .navigation {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0 16px;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 4px;
          text-align: left;
          position: relative;
        }

        .nav-item:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
          transform: translateX(2px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667EEA 0%, #ffffff 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .nav-item.active:hover {
          transform: translateX(0);
        }

        .nav-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
        }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-label.hidden {
          opacity: 0;
          transform: translateX(-10px);
        }

        .nav-label.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-section {
          padding: 20px 16px;
          border-top: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.2s;
          position: relative;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .sidebar.collapsed .user-avatar {
          width: 32px;
          height: 32px;
        }

        .user-info {
          min-width: 0;
          flex: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-info.hidden {
          opacity: 0;
          transform: translateX(-10px);
        }

        .user-info.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .logout-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        .sidebar.collapsed .logout-btn {
          width: 32px;
          height: 32px;
        }

        .content-area {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          background: white;
          margin: 20px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .content-area h1 {
          margin: 0 0 16px 0;
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
        }

        .content-area p {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* Scrollbar styling */
        .navigation::-webkit-scrollbar {
          width: 4px;
        }

        .navigation::-webkit-scrollbar-track {
          background: transparent;
        }

        .navigation::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .navigation::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            height: 100vh;
            z-index: 1000;
          }
          
          .sidebar.collapsed {
            transform: translateX(-100%);
            width: 280px;
          }
        }
      `}</style>
    </>
  )
}