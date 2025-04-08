import { useState } from 'react'
import axios from 'axios'
import ChatDirection from '@/models/ChatDirection'
import ChatEvent from '@/models/ChatEvent'
import { AppMap } from '@/components/AppMap'
import AppStack from './AppStack'

export default function ChatConversation(props) {
  const [input, setInput] = useState('')

 

  return (
    <>
      <div data-simplebar id='chat_body' className='chat-body'>
        <ul id='dummy_avatar' className='list-unstyled chat-single-list'>
          {props.conversation
            .get(props.selectedAppClient)
            ?.getItems()
            ?.filter(
              (msg: unknown) =>
                msg.message !== undefined && msg.message?.trim() !== ''
            )
            ?.map((msg: unknown) => (
              <li
                key={`${msg.identifier}-${msg.timestamp}`}
                className='media sent'
              >
                <div className='media-body'>
                  <div className='msg-box'>
                    <div>
                      <p>{msg.message}</p>
                      <span className='chat-time'>{msg.timestamp}</span>
                    </div>
                    <div className='msg-action'></div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  )
}
