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
  ChevronRight
} from 'lucide-react'
import { AppAgent } from '@/models/AppAgent';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed?: boolean;
  isHovered?: boolean;
  toggleSidebar?: () => void;
  setIsHovered?: (hovered: boolean) => void;
}

export default function ModernSidebar({ 
  isCollapsed: propCollapsed,
  isHovered: propHovered,
  toggleSidebar: propToggleSidebar,
  setIsHovered: propSetIsHovered 
}: SidebarProps = {}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [internalHovered, setInternalHovered] = useState(false)
  const [activeItem, setActiveItem] = useState('Chat')
  const [connectedAgent, setConnectedAgent] = useState<AppAgent | null>(null);
  

  // Use props if provided, otherwise use internal state
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed
  const isHovered = propHovered !== undefined ? propHovered : internalHovered
  const toggleSidebar = propToggleSidebar || (() => setInternalCollapsed(!internalCollapsed))
  const setIsHovered = propSetIsHovered || setInternalHovered


  const navigationItems = [
  { id: 'Dashboard', label: 'Dashboard', icon: Home, path: '/AppDashboard' },
  // { id: 'Chat', label: 'Chat', icon: MessageCircle, path: '/chat' },
  { id: 'Analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' }
  ]

  const shouldShowFullContent = !isCollapsed || isHovered
  const location = useLocation();

  useEffect(() => {
      const cookies = document.cookie.split('; ').reduce((acc, current) => {
        const [key, value] = current.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      console.log("Parsed cookies:", cookies);

      const userJson = cookies['user'];
      if (userJson) {
        console.log("yes")
        const user = JSON.parse(decodeURIComponent(userJson));
        console.log("Logged in user: from sidebar", user);
        setConnectedAgent(user);
        console.log("Connected agent ", connectedAgent);
      }
  }, [isCollapsed,connectedAgent]);

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
                  <img src='/src/assets/img/TB Logo/TalkBase-Logo-NO-BG.png' height={50} width={50} />
                </div>
                <span className="logo-text">TalkBase</span>
              </div>
            ) : (
              <div className="logo-collapsed">
                  <img src='/images/TalkBase-Logo.png' height={50} width={50} />
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
              {item.badge && <span className="badge">{item.badge}</span>}
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
            {shouldShowFullContent && (
              <div className={`user-info ${shouldShowFullContent ? 'visible' : 'hidden'}`}>
                <div className="user-name">{connectedAgent?.firstname + ' ' + connectedAgent?.lastname}</div>
                <div className="user-role">{connectedAgent?.type}</div>
              </div>
            )}
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

        .search-section {
          padding: 0 16px 20px 16px;
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-section.hidden {
          opacity: 0;
          transform: translateX(-20px);
          pointer-events: none;
        }

        .search-section.visible {
          opacity: 1;
          transform: translateX(0);
          pointer-events: all;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 12px;
          transition: all 0.2s;
        }

        .search-box:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-box svg {
          color: #64748b;
          flex-shrink: 0;
        }

        .search-box input {
          border: none;
          background: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          color: #1e293b;
        }

        .search-box input::placeholder {
          color: #94a3b8;
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
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-profile:hover {
          background: #f1f5f9;
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