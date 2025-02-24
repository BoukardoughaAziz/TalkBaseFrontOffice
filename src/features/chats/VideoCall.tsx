import axios from 'axios'
import { useEffect, useState } from 'react'
// Default styles for LiveKit components
import {
  LiveKitRoom
} from '@livekit/components-react'
import '@livekit/components-styles'
import ClipLoader from 'react-spinners/ClipLoader'
import VideoCallConversation from './VideoCallConversation'

const VideoCall = () => {
  const [token, setToken] = useState()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => { 
      axios
      .post(
        import.meta.env.VITE_BACKEND_URL + '/api/livekit/generateLiveKitToken',
        { roomName: 'zea', userIdentity: 'sss' }
      )
      .then((liveKitToken) => { 
        setToken(liveKitToken.data)
        setIsConnected(true)
      })

    return () => {}
  }, [])
  return (
    <div
      style={{
        height: '100%',
        backgroundColor: 'green',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {!isConnected && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        >
         
        </div>
      )}
      <LiveKitRoom style={{ width: '100%', height: '100%' }}
        serverUrl='wss://app1-9nmq6hp8.livekit.cloud'
        token={token}
        connect={true} 
        
       
      >
       
        <VideoCallConversation setIsConnected={setIsConnected}></VideoCallConversation>
   
      </LiveKitRoom>
    </div>
  )
} 

export default VideoCall
