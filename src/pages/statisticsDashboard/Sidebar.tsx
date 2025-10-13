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
  LogOut,
  Sparkles,
  Activity
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  const navigate = useNavigate();

  // Use props if provided, otherwise use internal state
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed
  const isHovered = propHovered !== undefined ? propHovered : internalHovered
  const toggleSidebar = propToggleSidebar || (() => setInternalCollapsed(!internalCollapsed))
  const setIsHovered = propSetIsHovered || setInternalHovered

  const navigationItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: Home, path: '/AppDashboard', color: '#667eea' },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, path: '/analytics', color: '#10b981' }
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

  const getInitials = (firstname?: string, lastname?: string) => {
    const first = firstname?.[0] || '';
    const last = lastname?.[0] || '';
    return (first + last).toUpperCase() || 'U';
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
                  <img 
                    src='https://res.cloudinary.com/derpsow86/image/upload/v1760315195/TalkBase-Logo-NO-BG_cloahh.png' 
                    alt="TalkBase Logo"
                    className="logo-image"
                  />
                </div>
                <div className="logo-text-wrapper">
                  <span className="logo-text">TalkBase</span>
                  <span className="logo-tagline">Support Platform</span>
                </div>
              </div>
            ) : (
              <div className="logo-collapsed">
                <img 
                  src='https://res.cloudinary.com/derpsow86/image/upload/v1760315197/TalkBase-Logo_ypyoja.png' 
                  alt="TalkBase"
                  className="logo-image-collapsed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        {shouldShowFullContent && (
          <button 
            className="toggle-btn-floating"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ left: '250px' }} // Move button further left
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}

        {/* Status Indicator */}
        {shouldShowFullContent && (
          <div className="status-section">
            <div className="status-indicator">
              <Activity size={14} className="status-icon" />
              <span className="status-text">All Systems Operational</span>
            </div>
          </div>
        )}

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
                      style={isActive ? { '--accent-color': item.color } as React.CSSProperties : {}}
                    >
                      <div className="nav-icon">
                        <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      {shouldShowFullContent && (
                        <span className="nav-label">
                          {item.label}
                        </span>
                      )}
                      {isActive && shouldShowFullContent && (
                        <div className="active-indicator"></div>
                      )}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Quick Actions */}
          {shouldShowFullContent && (
            <div className="quick-actions">
              <div className="section-label">Quick Actions</div>
              <button className="quick-action-btn">
                <Sparkles size={18} />
                <span>New Campaign</span>
              </button>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="user-section">
          <div className="user-profile">
            <div className="user-avatar">
              {connectedAgent ? (
                <span className="avatar-initials">
                  {getInitials(connectedAgent.firstname, connectedAgent.lastname)}
                </span>
              ) : (
                <User size={20} />
              )}
              <div className="online-status"></div>
            </div>
            
            {shouldShowFullContent && connectedAgent && (
              <div className="user-info">
                <div className="user-name">
                  {connectedAgent.firstname} {connectedAgent.lastname}
                </div>
                <div className="user-role">
                  <span className="role-badge">{connectedAgent.type}</span>
                </div>
              </div>
            )}
            
            <button 
              className="logout-btn"
              onClick={() => setShowLogoutConfirm(true)}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Version Info */}
          {shouldShowFullContent && (
            <div className="version-info">
              <span>Version 2.0.1</span>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <LogOut size={24} />
              </div>
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn confirm"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
          border-right: 1px solid #e5e7eb;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar.collapsed:hover {
          width: 280px;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
        }

        /* Header Styles */
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .logo-section {
          flex: 1;
        }

        .logo-full {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 4px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-collapsed {
          display: flex;
          justify-content: center;
          padding: 4px;
        }

        .logo-image-collapsed {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .logo-text-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .logo-tagline {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .toggle-btn-floating {
          position: absolute;
          top: 32px;
          right: -12px;
          width: 28px;
          height: 28px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          z-index: 101;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .toggle-btn-floating:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
          transform: scale(1.1);
        }

        /* Status Section */
        .status-section {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%);
          border-radius: 10px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-icon {
          color: #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .status-text {
          font-size: 12px;
          font-weight: 600;
          color: #059669;
        }

        /* Navigation Styles */
        .navigation {
          flex: 1;
          padding: 24px 0;
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
          gap: 14px;
          padding: 14px 18px;
          border: none;
          background: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 15px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 6px;
          text-align: left;
          position: relative;
        }

        .nav-item:hover {
          background: #f9fafb;
          color: #374151;
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
          color: var(--accent-color, #667eea);
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .nav-item.active:hover {
          transform: translateX(0);
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
        }

        .nav-label {
          white-space: nowrap;
          flex: 1;
        }

        .active-indicator {
          width: 6px;
          height: 6px;
          background: var(--accent-color, #667eea);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--accent-color, #667eea);
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }

        /* Quick Actions */
        .quick-actions {
          padding: 20px 16px;
          border-top: 1px solid #f3f4f6;
          margin-top: 20px;
        }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          padding: 0 4px;
        }

        .quick-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 2px dashed #e5e7eb;
          background: #fafbfc;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .quick-action-btn:hover {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          color: #667eea;
          transform: translateY(-2px);
        }

        /* User Section */
        .user-section {
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #fafbfc 0%, #ffffff 100%);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 14px;
          background: white;
          border: 1px solid #f3f4f6;
          transition: all 0.2s;
        }

        .user-profile:hover {
          border-color: #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 16px;
          position: relative;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .sidebar.collapsed .user-avatar {
          width: 36px;
          height: 36px;
          font-size: 14px;
        }

        .avatar-initials {
          user-select: none;
        }

        .online-status {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background: #10b981;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .user-info {
          min-width: 0;
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }

        .user-role {
          display: flex;
          align-items: center;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          color: #667eea;
          font-size: 11px;
          font-weight: 600;
          border-radius: 8px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .logout-btn {
          width: 38px;
          height: 38px;
          border: none;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 12px;
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
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
        }

        .logout-btn:active {
          transform: translateY(0);
        }

        .sidebar.collapsed .logout-btn {
          width: 34px;
          height: 34px;
        }

        .version-info {
          margin-top: 12px;
          text-align: center;
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Logout Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .modal-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #ef4444;
        }

        .modal-header h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .modal-header p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn.cancel {
          background: #f3f4f6;
          color: #6b7280;
        }

        .modal-btn.cancel:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .modal-btn.confirm {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .modal-btn.confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
        }

        /* Scrollbar */
        .navigation::-webkit-scrollbar {
          width: 6px;
        }

        .navigation::-webkit-scrollbar-track {
          background: transparent;
        }

        .navigation::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .navigation::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }

        /* Mobile Responsiveness */
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