import { useState, useRef, useEffect } from 'react';
import { 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  BarChart3
} from 'lucide-react';

interface GoogleLookerDashboardProps {
  dashboardUrl?: string;
  title?: string;
  height?: string;
  width?: string;
}

export default function GoogleLookerDashboard({
  dashboardUrl = "https://lookerstudio.google.com/embed/reporting/0ddb21e4-3bec-4029-ad8a-552058573c07/page/htnY",
  title = "Analytics Dashboard",
  height = "calc(100vh - 160px)",
  width = "100%"
}: GoogleLookerDashboardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Analaytics dashboard was loaded");
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const refreshDashboard = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const openInNewTab = () => {
    window.open(dashboardUrl, '_blank', 'noopener,noreferrer');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load dashboard. Please check your connection or try again later.');
  };

  return (
    <>
      <div className="dashboard-container">
        <div 
          ref={containerRef}
          className={`dashboard-wrapper ${isFullscreen ? 'fullscreen' : ''}`}
        >
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="header-left">
              <div className="title-section">
                <BarChart3 className="title-icon" />
                <div>
                  <h1 className="dashboard-title">{title}</h1>
                  <p className="dashboard-subtitle">Real-time analytics and insights</p>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button 
                onClick={refreshDashboard} 
                className="action-btn"
                title="Refresh Dashboard"
                disabled={isLoading}
              >
                <RefreshCw className={`icon ${isLoading ? 'spinning' : ''}`} />
              </button>

              <button 
                onClick={openInNewTab} 
                className="action-btn"
                title="Open in New Tab"
              >
                <ExternalLink className="icon" />
              </button>

              <button 
                onClick={toggleFullscreen} 
                className="action-btn"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="icon" /> : <Maximize2 className="icon" />}
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="dashboard-content">
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading Dashboard...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="error-overlay">
                <div className="error-content">
                  <BarChart3 className="error-icon" />
                  <h3>Dashboard Unavailable</h3>
                  <p>{error}</p>
                  <button onClick={refreshDashboard} className="retry-btn">
                    <RefreshCw className="icon" />
                    Try Again
                  </button>
                </div>
              </div>
            )}

        <iframe
        ref={iframeRef}
        src={dashboardUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, flex: 1 }}
        allowFullScreen
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        className="dashboard-iframe"
        title="Google Looker Studio Dashboard"
        />

          </div>

          {/* Dashboard Footer */}
          <div className="dashboard-footer">
            <div className="footer-left">
              <span className="status-indicator">
                <div className={`status-dot ${error ? 'error' : isLoading ? 'loading' : 'success'}`}></div>
                {error ? 'Connection Error' : isLoading ? 'Loading...' : 'Connected'}
              </span>
            </div>
            
            <div className="footer-right">
              <span className="powered-by">
                Powered by Google Looker Studio
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8f4f8 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 0;
          margin: 0;
          overflow: hidden;
        }

        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: white;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .dashboard-wrapper.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          min-height: 80px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          width: 32px;
          height: 32px;
          color: rgba(255, 255, 255, 0.9);
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: white;
        }

        .dashboard-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .icon {
          width: 18px;
          height: 18px;
          color: white;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .dashboard-content {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .dashboard-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: white;
          flex: 1;
        }

        .loading-overlay,
        .error-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 250, 252, 0.95);
          backdrop-filter: blur(8px);
          z-index: 10;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-spinner p {
          color: #6b7280;
          font-weight: 500;
          margin: 0;
        }

        .error-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
          max-width: 400px;
          padding: 40px;
        }

        .error-icon {
          width: 48px;
          height: 48px;
          color: #ef4444;
        }

        .error-content h3 {
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .error-content p {
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .retry-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .retry-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .dashboard-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 30px;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          flex-shrink: 0;
          min-height: 50px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6b7280;
          font-weight: 500;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.success {
          background: #10b981;
        }

        .status-dot.loading {
          background: #f59e0b;
        }

        .status-dot.error {
          background: #ef4444;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .powered-by {
          color: #9ca3af;
          font-weight: 400;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .dashboard-header {
            padding: 15px 20px;
            flex-direction: column;
            gap: 15px;
            min-height: auto;
          }

          .title-section {
            order: 1;
          }

          .header-actions {
            order: 0;
            align-self: flex-end;
          }

          .dashboard-title {
            font-size: 20px;
          }

          .dashboard-footer {
            padding: 10px 20px;
            flex-direction: column;
            gap: 8px;
            text-align: center;
            min-height: auto;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header {
            padding: 12px 16px;
          }

          .dashboard-footer {
            padding: 8px 16px;
          }

          .action-btn {
            width: 36px;
            height: 36px;
          }

          .icon {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </>
  );
}