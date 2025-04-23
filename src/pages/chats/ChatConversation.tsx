import ChatDirection from '@/models/ChatDirection';
import { format } from 'date-fns';
import './ChatConversation.css';
import { Conversation } from '@/models/Conversation';
import { ClientInformation } from '@/models/ClientInformation';

interface ChatConversationProps {
  conversation: Conversation | null;
  setConversation: (conversation: Conversation) => void;
  ClientInformation: ClientInformation;
  setClientInformation: (clientInformation: ClientInformation) => void;
  conversations: Conversation[];
}

export default function ChatConversation({
  conversation,
  setConversation,
  ClientInformation
}: ChatConversationProps) {
  return (
    <>
      <div data-simplebar id='chat_body' className='chat-body'>
        <ul className='list-unstyled chat-single-list'>
          {conversation?.messages
            .filter(
              (msg) => msg.message && msg.message.trim() !== ''
            )
            .sort(
              (a, b) =>
                new Date(a.timestamp ?? '').getTime() -
                new Date(b.timestamp ?? '').getTime()
            )
            .map((msg) => (
              <li
                key={`${msg.identifier}-${msg.timestamp}`}
                className={`chat-message ${
                  msg.chatDirection === ChatDirection.FromAgentToCLient
                    ? 'sent'
                    : 'received'
                }`}
              >
                <div className='message-content'>
                  <div className='msg-box'>
                    <div>
                      <p>{msg.message}</p>
                      <span className='chat-time'>
                        {msg.timestamp
                          ? format(new Date(msg.timestamp), 'HH:mm')
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
