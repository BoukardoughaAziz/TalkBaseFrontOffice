import { useEffect, useState } from 'react'
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
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { AppMap } from '@/components/AppMap'
import { Button } from '@/components/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search' 
import AppStack from './AppStack'

export default function Chats() {
  const currentUserEmail = useSelector((state) => state.currentUserEmail)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [selectedAppClient, setSelectedAppClient] = useState<
    AppClient | undefined
  >(undefined)

  const [conversation, setConversation] = useState(new AppMap())

  const socket = io(import.meta.env.VITE_SOCK_JS_CALL_CENTER_URL, {
    transports: [import.meta.env.VITE_SOCK_JS_TRANSPORT_PROTOCOL],
  })
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

  const handleSend = (e) => {     
    e.preventDefault()
    if (input.trim()) {
      setInput('')
      let newChatMessage = {
        chatDirection: ChatDirection.FromClientToAgent,
        chatEvent: ChatEvent.MessageFromClientToAgent,
        appClient: selectedAppClient,
        message: input.trim(),
        timestamp:new Date()
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
      console.log(
        'total Messages ' + conversation.keys.length + '  ' + selectedAppClient
      )
    })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
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
                          selectedAppClient && 'sm:bg-muted'
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

            {/* Conversation */}
            <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0'>
              <div className='flex size-full flex-1'>
                <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                  <div className='chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                    {conversation
                      .get(selectedAppClient)
                      ?.getItems()
                      ?.filter(
                        (msg: unknown) =>
                          msg.message !== undefined &&
                          msg.message?.trim() !== ''
                      )
                      ?.map((msg: unknown) => (
                        <div key={`${msg.identifier}-${msg.timestamp}`}>
                          <div
                            className={cn(
                              'chat-box max-w-72 break-words px-3 py-2 shadow-lg',
                              msg.chatDirection === 'FromClientToAgent'
                                ? 'self-end rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
                                : 'self-start rounded-[16px_16px_16px_0] bg-secondary'
                            )}
                          >
                            {msg.message}{' '}
                            <span
                              className={cn(
                                'mt-1 block text-xs font-light italic text-muted-foreground',
                                msg.chatDirection === 'FromClientToAgent' &&
                                  'text-right'
                              )}
                            >
                              {format(msg.timestamp, 'h:mm a')}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <form className='flex w-full flex-none gap-2'>
                <div className='flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
                  <div className='space-x-1'>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='h-8 rounded-md'
                    >
                      <IconPlus size={20} className='stroke-muted-foreground' />
                    </Button>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='hidden h-8 rounded-md lg:inline-flex'
                    >
                      <IconPhotoPlus
                        size={20}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='hidden h-8 rounded-md lg:inline-flex'
                    >
                      <IconPaperclip
                        size={20}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                  </div>
                  <label className='flex-1'>
                    <span className='sr-only'>Chat Text Box</span>
                    <input
                      type='text'
                      placeholder='Type your messages...'
                      className='h-8 w-full bg-inherit focus-visible:outline-none'
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                    />
                  </label>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hidden sm:inline-flex'
                  >
                    <IconSend size={20} />
                  </Button>
                </div>
                <Button
                  className='h-full sm:hidden'
                  rightSection={<IconSend size={18} />}
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </section>
      </Main>
    </>
  )
}
