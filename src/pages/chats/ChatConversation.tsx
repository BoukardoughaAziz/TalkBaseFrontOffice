import { useState } from 'react'
import axios from 'axios'
import ChatDirection from '@/models/ChatDirection'
import ChatEvent from '@/models/ChatEvent'
import { AppMap } from '@/components/AppMap'
import AppStack from './AppStack'
import { format } from 'date-fns'
import './ChatConversation.css'

export default function ChatConversation(props) {
  const [input, setInput] = useState('')

  return (
    <>
      <div data-simplebar id='chat_body' className='chat-body'>
        <ul id='dummy_avatar' className='list-unstyled chat-single-list'>
          {props.selectedAppClient && props.conversation
            .get(props.selectedAppClient)
            ?.getItems()
            ?.filter(
              (msg: unknown) =>
                msg.message !== undefined && msg.message?.trim() !== ''
            )
            ?.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            ?.map((msg: unknown) => (
              <li
                key={`${msg.identifier}-${msg.timestamp}`}
                className={`chat-message ${
                  msg.chatDirection === 'FromAgentToCLient' ? 'sent' : 'received'
                }`}
              >
                <div className='message-content'>
                  <div className='msg-box'>
                    <div>
                      <p>{msg.message}</p>
                      <span className='chat-time'>
                        {format(new Date(msg.timestamp), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}
