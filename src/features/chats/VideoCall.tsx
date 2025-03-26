// Default styles for LiveKit components
import { LiveKitRoom } from '@livekit/components-react'
import '@livekit/components-styles'
import VideoCallConversation from './VideoCallConversation'

const VideoCall = ({ incomingToken }) => {
  return (
    <div className='video-call-wrapper'>
      <LiveKitRoom
        serverUrl='wss://app1-9nmq6hp8.livekit.cloud'
        token={incomingToken}
        connect={true}
        style={{ height: '100%' }}
        data-lk-theme='default'
      >
        <VideoCallConversation />
      </LiveKitRoom>
    </div>
  );
};

export default VideoCall;

