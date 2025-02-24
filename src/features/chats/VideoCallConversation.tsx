import { useEffect } from 'react'
// Default styles for LiveKit components
import {
    LayoutContextProvider,
    useRoomContext,
    VideoConference
} from '@livekit/components-react'
import '@livekit/components-styles'

const VideoCallConversation = (props) => {
  const room = useRoomContext()

  useEffect(() => {
    const handleConnectionChange = () => {
      props.setIsConnected(room.state === 'connected')
    }
    room.on('connectionStateChanged', handleConnectionChange)
    handleConnectionChange() // Initialize state

    return () => {
      // room.off('connectionStateChanged', handleConnectionChange)
    }
  }, [])
  return (
    <div style={{ width: "378px", height: "100%"}}>
       <LayoutContextProvider>
       <Stage  />
       
      </LayoutContextProvider>
    </div>
  )
}
function Stage() {
  
  return (
    <>
       <VideoConference  style={{maxWidth: "100%", maxHeight: "100%"}} />
    </>
  )
}
export default VideoCallConversation
