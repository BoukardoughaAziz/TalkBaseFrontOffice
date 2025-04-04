import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconPhone,
  IconVideo,
  IconX,
} from '@tabler/icons-react'
import { AppClient } from '@/models/AppClient'
import ChatDirection from '@/models/ChatDirection'
import ChatEvent from '@/models/ChatEvent'
import { ChatMessage } from '@/models/ChatMessage'
import { Phone, Video } from 'lucide-react'
import { useSelector } from 'react-redux'
import { cn } from '@/lib/utils'
import { useWebSocket } from '@/context/WebSocketProvider'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AppMap } from '@/components/AppMap'
import { Button } from '@/components/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import AppStack from './AppStack'
import CallStatus from './CallStatus'
import './Chat.css'
import ChatConversation from './ChatConversation'
import ChatLeftSide from './ChatLeftSide'
import VideoCall from './VideoCall'

export default function Chat() {
  const currentUserEmail = useSelector((state) => state.currentUserEmail)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [selectedAppClient, setSelectedAppClient] = useState<
    AppClient | undefined
  >(undefined)

  const [conversation, setConversation] = useState(new AppMap())
  const socket = useWebSocket()
  const messageEndRef = useRef(null)

  const [incomingCall, setIncomingCall] = useState({
    callStatus: CallStatus.INACTIVE,
    callerName: '',
    data: null,
    token: '',
  })

  // Add this new state for audio
  const [notificationSound] = useState(new Audio('../../public/notif.wav'))

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
          '/api/chat/callcenter/getCallCenterDashboard?callCenterAgentEmail=' +
          currentUserEmail
      )
      .then((response) => {
        const newMap = new Map(Object.entries(response.data))
        const newConversation = new AppMap()
        let setSelectedAppClientBoolean = false
        for (const [key, value] of newMap) {
          const appClient: AppClient = JSON.parse(key)
          if (!setSelectedAppClientBoolean) {
            setSelectedAppClient(appClient)
            setSelectedAppClientBoolean = true
          }
          const chatMessagesAppStack = new AppStack()
          for (const chatMessage of value) {
            chatMessagesAppStack.push(chatMessage)
          }

          newConversation.set(appClient, chatMessagesAppStack)
        }
        setConversation(newConversation)
        // console.log(response)
      })
    handleSocket()
  }, [])

  useEffect(() => {
    if (messageEndRef.current) {
      const chatContainer = messageEndRef.current.parentElement
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [conversation])

  const handleSend = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setInput('')
      let newChatMessage = {
        chatDirection: ChatDirection.FromAgentToCLient,
        chatEvent: ChatEvent.MessageFromAgentToClient,
        appClient: selectedAppClient,
        message: input.trim(),
        timestamp: new Date(),
      }
      axios.post(
        import.meta.env.VITE_BACKEND_URL_CALL_CENTER +
          '/addMessageFromAgentToClient',
        newChatMessage
      )
      const newConversation = new AppMap(conversation)
      const appStack: AppStack<unknown> = newConversation.get(selectedAppClient)
      appStack.push(newChatMessage)
      setConversation(newConversation)
    }
  }

  const handleSocket = () => {
    socket.on('CLIENT_START_VIDEO_CALL', (data) => {
      // Play notification sound
      notificationSound
        .play()
        .catch((err) => console.log('Audio playback failed:', err))

      setIncomingCall({
        callStatus: CallStatus.INCOMING_CALL,
        callerName: data.clientName,
        data: data,
        token: data.token,
      })
    })

    socket.on('getListOfNonTreatedClients', (data) => {
      console.log('getListOfNonTreatedClients')
      //  data.map((fruit) => console.log('s'))
    })
    socket.on('MESSAGE_FROM_CLIENT_TO_AGENT', (data) => {
      console.log('received something')
      const chatMessage: ChatMessage = JSON.parse(data)
      const newConversation = new AppMap(conversation)
      let oldMessages: AppStack<ChatMessage> = newConversation.get(
        chatMessage.appClient
      )
      if (oldMessages == null) {
        oldMessages = new AppStack()
      }
      oldMessages.push(chatMessage)
      newConversation.set(chatMessage.appClient, oldMessages)
      if (newConversation.entries.length == 0) {
        setSelectedAppClient(chatMessage.appClient)
      }

      setConversation(newConversation)
    })
  }

  const acceptIncomingCall = () => {
    setIncomingCall({
      callStatus: CallStatus.ACCEPT_CALL,
      callerName: '',
      data: null,
      token: incomingCall.token,
    })
  }

  const rejectIncomingCall = () => {
    setIncomingCall({
      callStatus: CallStatus.REJECT_CALL,
      callerName: '',
      data: null,
      token: '',
    })
  }
  const audioRef = useRef(null)

  useEffect(() => {
    if (
      incomingCall.callStatus === CallStatus.INCOMING_CALL &&
      audioRef.current
    ) {
      audioRef.current
        .play()
        .catch((e) => console.error('Error playing sound:', e))
    } else if (
      !incomingCall.callStatus === CallStatus.INCOMING_CALL &&
      audioRef.current
    ) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [incomingCall.callStatus])
  return (
    <>
      <AlertDialog
        open={incomingCall.callStatus === CallStatus.ACCEPT_CALL}
        onOpenChange={(open) => !open && rejectIncomingCall()}
      >
        <AlertDialogContent className='calling-overlay'>
          <AlertDialogTitle>title1</AlertDialogTitle>
          <div className='calling-content'>
            <VideoCall token={incomingCall.token} />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          <ChatLeftSide
            conversation={conversation}
            selectedAppClient={selectedAppClient}
            setSelectedAppClient={setSelectedAppClient}
          ></ChatLeftSide>

          {/* Right Side */}
          <div
            className={cn(
              'absolute right-0 top-0 hidden z-50 w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex sm:w-auto sm:right-0',
              selectedAppClient && 'left-0 flex'
            )}
          >
            {/* Top Part */}
            {selectedAppClient !== undefined && (
              <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
                {/* Left */}
                <div className='flex gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='-ml-2 h-full sm:hidden'
                    onClick={() => setSelectedAppClient(null)}
                  >
                    <IconArrowLeft />
                  </Button>
                  <div className='flex items-center gap-2 lg:gap-4'>
                    <div>
                      <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                        {selectedAppClient.humanIdentifier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                  {/* Ringtone Audio */}
                  <audio ref={audioRef} src='/ringtone.mp3' loop />

                  {/* Video Call Button */}
                  <Button
                    size='icon'
                    variant='ghost'
                    className={cn(
                      'hidden size-8 rounded-full sm:inline-flex lg:size-10 transition-all',
                      incomingCall.callStatus === CallStatus.INCOMING_CALL
                        ? 'animate-wiggle animate-pulse bg-green-500 text-white shadow-lg'
                        : 'bg-transparent text-muted-foreground'
                    )}
                    onClick={acceptIncomingCall}
                  >
                    <Video size={22} className='stroke-current' />
                  </Button>

                  {/* Phone Call Button */}
                  <Button
                    size='icon'
                    variant='ghost'
                    className={cn(
                      'hidden size-8 rounded-full sm:inline-flex lg:size-10 transition-all',
                      incomingCall.callStatus === CallStatus.INCOMING_CALL
                        ? 'animate-wiggle animate-pulse bg-green-500 text-white shadow-lg'
                        : 'bg-transparent text-muted-foreground'
                    )}
                  >
                    <Phone size={22} className='stroke-current' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                  >
                    <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
                  </Button>
                </div>
              </div>
            )}

            <ChatConversation
              conversation={conversation}
              selectedAppClient={selectedAppClient}
              setConversation={setConversation}
            />
          </div>
        </section>
      </Main>
    </>
  )
}
