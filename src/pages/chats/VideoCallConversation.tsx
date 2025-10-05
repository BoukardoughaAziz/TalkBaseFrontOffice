import { useEffect } from 'react'
import {
    LayoutContextProvider,
    useRoomContext,
    VideoConference,
    ControlBar,
    useTracks,
    TrackToggle,
    Chat,
    ChatToggle,
    ParticipantName
} from '@livekit/components-react'
import '@livekit/components-styles'

const VideoCallConversation = (props) => {
  const room = useRoomContext()

  useEffect(() => {
    const handleConnectionChange = () => {
      props.setIsConnected(room.state === 'connected')
    }
    room.on('connectionStateChanged', handleConnectionChange)
    handleConnectionChange()

    return () => {
      room.off('connectionStateChanged', handleConnectionChange)
    }
  }, [room, props])

  return (
    <div className="video-container">
      <LayoutContextProvider>
        <Stage />
        <CustomControlBar />
      </LayoutContextProvider>

      <style>{`
        .video-container {
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #2C3E50, #1a1a1a);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }
      `}</style>
    </div>
  )
}

function Stage() {
  return (
    <div className="stage-container">
      <VideoConference
        className="video-conference"
        style={{
          borderRadius: '12px',
          background: 'transparent',
          height: '100%',
          aspectRatio: '16/9',
        }}
      />

      <style>{`
        .stage-container {
          width: 100%;
          flex: 1;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        :global(.video-conference) {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        :global(.lk-participant-name) {
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        :global(.lk-video-conference) {
          --lk-participant-border-radius: 12px;
          --lk-participant-grid-gap: 10px;
        }
      `}</style>
    </div>
  )
}

function CustomControlBar() {
  return (
    <div className="control-bar-container">
      <ControlBar
        variation="minimal"
        controls={{
          microphone: true,
          camera: true,
          screenShare: true,
          chat: true,
          leave: true,
        }}
      />
      <style>{`
        .control-bar-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 12px 24px;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        :global(.lk-control-bar) {
          gap: 24px;
        }

        :global(.lk-button) {
          background: rgba(255, 255, 255, 0.9) !important;
          color: #1a1a1a !important;
          padding: 12px !important;
          border-radius: 50% !important;
          transition: all 0.2s ease !important;
          width: 44px !important;
          height: 44px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }

        :global(.lk-button:hover) {
          background: white !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        }

        :global(.lk-button svg) {
          width: 20px !important;
          height: 20px !important;
          stroke-width: 2px !important;
        }

        :global(.lk-button-variant-danger) {
          background: #ff4444 !important;
          color: white !important;
        }

        :global(.lk-button-variant-danger:hover) {
          background: #ff6666 !important;
        }

        :global(.lk-button[data-enabled='false']) {
          background: #ff4444 !important;
          color: white !important;
        }

        :global(.lk-button[data-enabled='false']:hover) {
          background: #ff6666 !important;
        }

        :global(.lk-button[data-enabled='false'] svg) {
          stroke: white !important;
        }
      `}</style>
    </div>
  )
}

export default VideoCallConversation
