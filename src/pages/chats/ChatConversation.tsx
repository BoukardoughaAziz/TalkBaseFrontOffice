import { useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import {
  IconPaperclip,
  IconPhotoPlus,
  IconPlus,
  IconSend,
} from '@tabler/icons-react'
import ChatDirection from '@/models/ChatDirection'
import ChatEvent from '@/models/ChatEvent'
import { cn } from '@/lib/utils'
import { AppMap } from '@/components/AppMap'
import { Button } from '@/components/button'
import ClientInformationUI from '../ClinetInformation/ClientInformationUI'
import AppStack from './AppStack'

export default function ChatConversation(props) {
  const [input, setInput] = useState('')

  const handleSendChatMessage = (e) => {
    e.preventDefault()
    if (input.trim()) {
      setInput('')
      const newChatMessage = {
        chatDirection: ChatDirection.FromClientToAgent,
        chatEvent: ChatEvent.MessageFromClientToAgent,
        appClient: props.selectedAppClient,
        message: input.trim(),
        timestamp: new Date(),
      }
      axios.post(
        import.meta.env.VITE_BACKEND_URL_CALL_CENTER +
          '/addMessageFromAgentToClient',
        newChatMessage
      )
      const newConversation = new AppMap(props.conversation)
      const appStack: AppStack<unknown> = newConversation.get(
        props.selectedAppClient
      )
      appStack.push(newChatMessage)
      props.setConversation(newConversation)
    }
  }

  return (
    <>
      {/* Conversation */}
      <div className='flex flex-1 flex-col gap-2 rounded-md  pb-4 pt-0'>
        <div className='flex size-full flex-1'>
          <div className='flex w-full justify-between'>
            {/* Chat Container (Left) */}
            <div className='chat-text-container relative flex flex-1 flex-col overflow-y-hidden'>
              <div className='chat-flex flex h-40 w-full flex-grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pb-4 pr-4'>
                {props.conversation
                  .get(props.selectedAppClient)
                  ?.getItems()
                  ?.filter(
                    (msg: unknown) =>
                      msg.message !== undefined && msg.message?.trim() !== ''
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

        
            {/* <div className='flex flex-none justify-end'>
              {props.conversation.size() > 0 && <ClientInformationUI />}
            </div> */}
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
                <IconPhotoPlus size={20} className='stroke-muted-foreground' />
              </Button>
              <Button
                size='icon'
                type='button'
                variant='ghost'
                className='hidden h-8 rounded-md lg:inline-flex'
              >
                <IconPaperclip size={20} className='stroke-muted-foreground' />
              </Button>
            </div>
            <label className='flex-1'>
              <span className='sr-only'>Chat Text Box</span>
              <input
                type='text'
                placeholder='Type your messages...'
                className='h-8 w-full bg-inherit focus-visible:outline-none'
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage(e)}
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
    </>
  )
}
