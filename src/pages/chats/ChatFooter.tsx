import axios from "axios"
import AppStack from "./AppStack"
import { useState } from "react"
import ChatDirection from "@/models/ChatDirection"
import ChatEvent from "@/models/ChatEvent"
import { AppMap } from "@/components/AppMap"

export default function ChatFooter(props) {
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
      <footer className='chat-footer'>
        <button
          className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover flex-shrink-0'
          data-bs-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
        >
          <span className='icon'>
            <span className='feather-icon'>
              <i data-feather='share'></i>
            </span>
          </span>
        </button>
        <div className='dropdown-menu'>
          <a className='dropdown-item' href='#'>
            <div className='d-flex align-items-center'>
              <div className='avatar avatar-icon avatar-xs avatar-soft-primary avatar-rounded me-3'>
                <span className='initial-wrap'>
                  <i className='ri-image-line'></i>
                </span>
              </div>
              <div>
                <span className='h6 mb-0'>Photo or Video Library</span>
              </div>
            </div>
          </a>
          <a className='dropdown-item' href='#'>
            <div className='d-flex align-items-center'>
              <div className='avatar avatar-icon avatar-xs avatar-soft-info avatar-rounded me-3'>
                <span className='initial-wrap'>
                  <i className='ri-file-4-line'></i>
                </span>
              </div>
              <div>
                <span className='h6 mb-0'>Documents</span>
              </div>
            </div>
          </a>
          <a className='dropdown-item' href='#'>
            <div className='d-flex align-items-center'>
              <div className='avatar avatar-icon avatar-xs avatar-soft-success avatar-rounded me-3'>
                <span className='initial-wrap'>
                  <i className='ri-map-pin-line'></i>
                </span>
              </div>
              <div>
                <span className='h6 mb-0'>Location</span>
              </div>
            </div>
          </a>
          <a className='dropdown-item' href='#'>
            <div className='d-flex align-items-center'>
              <div className='avatar avatar-icon avatar-xs avatar-soft-blue avatar-rounded me-3'>
                <span className='initial-wrap'>
                  <i className='ri-contacts-line'></i>
                </span>
              </div>
              <div>
                <span className='h6 mb-0'>Contact</span>
              </div>
            </div>
          </a>
        </div>
        <div className='input-group'>
          <span className='input-affix-wrapper'>
            <input
              type='text'
              id='input_msg_send_chatapp'
              name='send-msg'
              className='input-msg-send form-control rounded-input'
              placeholder='Type your message...'
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage(e)}
            />
            <span className='input-suffix'>
              <button className='btn btn-icon btn-flush-primary btn-rounded btn-send'>
                <span className='icon'>
                  <span className='feather-icon'>
                    <i data-feather='arrow-right'></i>
                  </span>
                </span>
              </button>
            </span>
          </span>
        </div>
        <button className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover'>
          <span className='icon'>
            <span className='feather-icon'>
              <i data-feather='smile'></i>
            </span>
          </span>
        </button>
      </footer>
    </>
  )
}
