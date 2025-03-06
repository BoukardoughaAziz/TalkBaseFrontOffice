import { useEffect, useState, useRef } from 'react'
import { Fragment } from 'react/jsx-runtime'
import axios from 'axios'
import { format } from 'date-fns'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconMessages,
  IconPaperclip,
  IconPhone,
  IconPhotoPlus,
  IconPlus,
  IconSearch,
  IconSend,
  IconVideo,
} from '@tabler/icons-react'
import { AppClient } from '@/models/AppClient'
import ChatDirection from '@/models/ChatDirection'
import ChatEvent from '@/models/ChatEvent'
import { ChatMessage } from '@/models/ChatMessage'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { cn } from '@/lib/utils'
import AppUtil from '@/utils/AppUtil'
import { useWebSocket } from '@/context/WebSocketProvider'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AppMap } from '@/components/AppMap'
import { Button } from '@/components/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import AppStack from './AppStack'
import VideoCall from './VideoCall'
import ClientInformation from './ClientInformation'
import ChatConversation from './ChatConversation'

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
  const [videoCallStarted, setVideoCallStarted] = useState(false)

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_BACKEND_URL +
          '/api/chat/callcenter/getCallCenterDashboard?callCenterAgentEmail=' +
          currentUserEmail
      )
      .then((response) => {
        const newMap = new Map(Object.entries(response.data))
        for (var clientMessage in response.data) {
          // console.log(clientMessage)
        }
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
    socket.emit('appAgentConnected', {
      message: 'zzzzzzzz',
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

  const handleClickVideoCall = (e) => {
    e.preventDefault()
    setVideoCallStarted(true)
  }

  return (
    <>
      <AlertDialog open={videoCallStarted} onOpenChange={setVideoCallStarted}>
        <AlertDialogContent style={{ width: '100%', height: '60%' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Video Call?</AlertDialogTitle>
          </AlertDialogHeader>
          <VideoCall></VideoCall>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className='bg-green-500 text-white px-4 py-2 rounded-lg'>
              Start Call
            </AlertDialogAction>
          </AlertDialogFooter>
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
          {/* Left Side */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Inbox</h1>
                  <IconMessages size={20} />
                </div>

                <Button size='icon' variant='ghost' className='rounded-lg'>
                  <IconEdit size={24} className='stroke-muted-foreground' />
                </Button>
              </div>

              <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
                <IconSearch size={15} className='mr-2 stroke-slate-500' />
                <span className='sr-only'>Search</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
                  placeholder='Search chat...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full p-3'>
              {Array.from(conversation.entries()).map(
                ([appClientIdentifier]) => {
                  const humanIdentifier = AppUtil.getAppClientByIdentifier(
                    conversation,
                    appClientIdentifier
                  ).humanIdentifier

                  const appClient = AppUtil.getAppClientByIdentifier(
                    conversation,
                    appClientIdentifier
                  )

                  return (
                    <Fragment key={appClientIdentifier}>
                      <button
                        type='button'
                        className={cn(
                          `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                          selectedAppClient?.identifier === appClient.identifier
                            ? 'bg-blue-100'
                            : 'hover:bg-secondary/75'
                        )}
                        onClick={() => {
                          setSelectedAppClient(appClient)
                        }}
                      >
                        <div className='flex gap-2  '>
                          <Avatar>
                            <AvatarImage
                              src='https://avatar.iran.liara.run/public'
                              alt='avatar'
                            />
                          </Avatar>
                          <div>
                            <span className='col-start-2 row-span-2 font-medium'>
                              {humanIdentifier}
                            </span>
                            <div className='flex flex-row ...'>
                              <Avatar>
                                <AvatarImage
                                  src='http://purecatamphetamine.github.io/country-flag-icons/3x2/TN.svg'
                                  alt='avatar'
                                />
                              </Avatar>
                              <div>
                                <Avatar>
                                  <AvatarImage
                                    src={AppUtil.getClientExplorerUrl(
                                      appClient?.appBrowser
                                    )}
                                    alt='avatar'
                                  />
                                </Avatar>
                              </div>
                              <div>
                                <Avatar>
                                  <AvatarImage
                                    src={AppUtil.getClientAppOsUrl(
                                      appClient?.appOS
                                    )}
                                    alt='avatar'
                                  />
                                </Avatar>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                      <Separator className='my-1' />
                    </Fragment>
                  )
                }
              )}
            </ScrollArea>
          </div>

          {/* Right Side */}
          <div
            className={cn(
              'absolute inset-0 hidden left-full z-50 w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
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
                    <Avatar>
                      <AvatarImage
                        src='https://avatar.iran.liara.run/public'
                        alt='avatar'
                      />
                    </Avatar>
                    <div>
                      <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                        {selectedAppClient.humanIdentifier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                    onClick={handleClickVideoCall}
                  >
                    <IconVideo size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                  >
                    <IconPhone size={22} className='stroke-muted-foreground' />
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

            <ClientInformation></ClientInformation>
            <ChatConversation
              conversation={conversation}
              selectedAppClient={selectedAppClient}
              setConversation={setConversation}
            ></ChatConversation>
          </div>
        </section>
      </Main>
    </>
  )
}
