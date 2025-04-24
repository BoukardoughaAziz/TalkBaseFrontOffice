import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AppClient } from '@/models/AppClient'
import ChatDirection from '@/models/ChatDirection'
import ChatEvent from '@/models/ChatEvent'
import { ChatMessage } from '@/models/ChatMessage'
import { useSelector } from 'react-redux'
import { useWebSocket } from '@/context/WebSocketProvider'
import { AppMap } from '@/components/AppMap'
import ClientInformationUI from '../ClinetInformation/ClientInformationUI'
import AppStack from './AppStack'
import CallStatus from './CallStatus'
import './Chat.css'
import ChatConversation from './ChatConversation'
import ChatLeftSide from './ChatLeftSide'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'
import conversationService from '@/services/Conversation/conversationService'
import { Conversation } from '@/models/Conversation'
import { ClientInformation } from '@/models/ClientInformation'

export default function Chat() {
  const currentUserEmail = useSelector((state) => state.currentUserEmail)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [selectedAppClient, setSelectedAppClient] = useState<
    AppClient | undefined
  >(undefined)

  const [conversation, setConversation] = useState(new AppMap(null))
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [convo, setConvo] = useState<Conversation>()
  const [clientInformation, setclientInformation] = useState<ClientInformation>()



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
        const newConversation = new AppMap(null)
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
    if (socket) {
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
        setConversation((prevConversation) => {
          const newConversation = new AppMap(prevConversation)
          let oldMessages: AppStack<ChatMessage> = newConversation.get(
            chatMessage.appClient
          )
          if (oldMessages == null) {
            oldMessages = new AppStack()
          }
          oldMessages.push(chatMessage)
          newConversation.set(chatMessage.appClient, oldMessages)
          if (newConversation.entries.length === 0) {
            setSelectedAppClient(chatMessage.appClient)
          }
          return newConversation
        })
      })
    }
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
    conversationService.getConversations().then((data) => {
      setConversations(data)
    }).catch((error) => {
      console.error('Error getting conversations:', error)
    })

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
      <div className='hk-pg-wrapper pb-0'>
        <div className='hk-pg-body py-0'>
          <div className='chatapp-wrap chatapp-info-active'>
            <div className='chatapp-content'>

              <ChatLeftSide
                conversation={conversation}
                selectedAppClient={selectedAppClient}
                setSelectedAppClient={setSelectedAppClient}
                conversations={conversations}
                setConvo={setConvo}
                ClientInformation={clientInformation}
                setClientInformation={setclientInformation}
              ></ChatLeftSide>

              <div className='chatapp-single-chat'>
              <ChatHeader></ChatHeader>

                <ChatConversation
                  conversation={convo}
                  setConversation={setConvo}
                  ClientInformation={clientInformation}
                  setClientInformation={setclientInformation}
                  conversations={conversations}
                ></ChatConversation>
              
                <ChatFooter
                  conversation={conversation}
                  selectedAppClient={selectedAppClient}
                  setConversation={setConversation}
                ></ChatFooter>
                
                  <ClientInformationUI
                  clientInformation={clientInformation}
                  conversation={convo}
                  setClientInformation={setclientInformation}
                  />
              </div>

              <div
                id='audio_call'
                className='modal fade'
                tabIndex={-1}
                role='dialog'
                aria-hidden='true'
              >
                <div
                  className='modal-dialog modal-dialog-centered modal-xl chatapp-call-window'
                  role='document'
                >
                  <div className='modal-content'>
                    <div className='modal-header header-wth-bg'>
                      <h6 className='modal-title text-muted'>
                        Jampack Audio Call
                      </h6>
                      <div className='modal-action'>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-flush-dark btn-rounded flush-soft-hover modal-fullscreen-togglable'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='maximize'></i>
                            </span>
                            <span className='feather-icon d-none'>
                              <i data-feather='minimize'></i>
                            </span>
                          </span>
                        </a>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-flush-dark btn-rounded flush-soft-hover'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='help-circle'></i>
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className='modal-body'>
                      <div className='avatar avatar-xxxl avatar-rounded d-20'>
                        <img
                          src='../assets/img/avatar8.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                      <h3 className='mt-3'>Huma Therman</h3>
                      <p>
                        Audio Calling<span className='one'>.</span>
                        <span className='two'>.</span>
                        <span className='three'>.</span>
                      </p>
                    </div>
                    <div className='modal-footer'>
                      <ul className='chatapp-call-action hk-list'>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='mic'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='video'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button
                            className='btn btn-icon btn-lg btn-rounded btn-danger'
                            data-bs-dismiss='modal'
                          >
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='phone'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='user-plus'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-soft-light'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='more-vertical'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                      <div className='avatar avatar-lg avatar-rounded chatapp-caller-img'>
                        <img
                          src='../assets/img/avatar13.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id='video_call'
                className='modal fade'
                tabIndex={-1}
                role='dialog'
                aria-hidden='true'
              >
                <div
                  className='modal-dialog modal-dialog-centered modal-xl chatapp-call-window'
                  role='document'
                >
                  <div className='modal-content bg-primary-dark-5'>
                    <div className='modal-header header-wth-bg bg-primary-dark-3'>
                      <h6 className='modal-title text-muted'>
                        Jampack Video Call
                      </h6>
                      <div className='modal-action'>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-rounded btn-link link-secondary modal-fullscreen-togglable'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='maximize'></i>
                            </span>
                            <span className='feather-icon d-none'>
                              <i data-feather='minimize'></i>
                            </span>
                          </span>
                        </a>
                        <a
                          href='#'
                          className='btn btn-xs btn-icon btn-rounded btn-link link-secondary'
                        >
                          <span className='icon'>
                            <span className='feather-icon'>
                              <i data-feather='help-circle'></i>
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className='modal-body'>
                      <div className='avatar avatar-xxxl avatar-rounded d-20'>
                        <img
                          src='../assets/img/avatar8.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                      <h3 className='text-white mt-3'>Huma Therman</h3>
                      <p className='text-white'>
                        Video Calling<span className='one'>.</span>
                        <span className='two'>.</span>
                        <span className='three'>.</span>
                      </p>
                    </div>
                    <div className='modal-footer'>
                      <ul className='chatapp-call-action hk-list'>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='mic'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='video'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button
                            className='btn btn-icon btn-lg btn-rounded btn-danger'
                            data-bs-dismiss='modal'
                          >
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='phone'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='user-plus'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                        <li>
                          <button className='btn btn-icon btn-lg btn-rounded btn-dark'>
                            <span className='icon'>
                              <span className='feather-icon'>
                                <i data-feather='more-vertical'></i>
                              </span>
                            </span>
                          </button>
                        </li>
                      </ul>
                      <div className='avatar avatar-lg avatar-rounded chatapp-caller-img'>
                        <img
                          src='../assets/img/avatar13.jpg'
                          alt='user'
                          className='avatar-img'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className='modal fade'
                id='invite_people'
                tabIndex={-1}
                role='dialog'
              >
                <div
                  className='modal-dialog modal-dialog-centered mw-400p'
                  role='document'
                >
                  <div className='modal-content'>
                    <div className='modal-header header-wth-bg-inv'>
                      <h5 className='modal-title'>Invite People</h5>
                      <button
                        type='button'
                        className='btn-close text-white'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                      >
                        <span aria-hidden='true'>×</span>
                      </button>
                    </div>
                    <div className='modal-body p-0'>
                      <form className='m-3' role='search'>
                        <input
                          type='text'
                          className='form-control rounded-input user-search'
                          placeholder='Search People'
                        />
                      </form>
                    </div>
                    <div className='modal-footer justify-content-center'>
                      <button
                        type='button'
                        className='btn flex-fill btn-light flex-1'
                        data-bs-dismiss='modal'
                      >
                        Cancel
                      </button>
                      <button
                        type='button'
                        className='btn flex-fill btn-primary flex-1'
                      >
                        Invite for chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
