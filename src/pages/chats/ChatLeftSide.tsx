import { useState } from 'react'
import AppUtil from '@/utils/AppUtil'
import { AppMap } from '@/components/AppMap'
import { AppClient } from '@/models/AppClient'
import { Conversation } from '@/models/Conversation'
import { ClientInformation } from '@/models/ClientInformation'
import ClientInformationService from '@/services/Client Informations/ClientInformationService'
import { set } from 'lodash'

interface ChatLeftSideProps {
  conversation: AppMap<AppClient, unknown>
  selectedAppClient: AppClient | undefined
  setSelectedAppClient: (client: AppClient) => void
  conversations: Conversation[];
  setConvo: (conversation: Conversation) => void;
  ClientInformation: ClientInformation;
  setClientInformation: (ClientInformation: ClientInformation) => void;
}

export default function ChatLeftSide(props: ChatLeftSideProps) {
  const [search, setSearch] = useState('')

  return (
    <>
      <div className='chatapp-aside'>
        <div data-simplebar className='aside-body'>
          <form className='aside-search' role='search'>
            <input
              type='text'
              className='form-control'
              placeholder='Search Chats'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <ul className='chat-contacts-list list-group list-group-flush'>
            {props.conversations
              .filter((conversation) =>
                conversation.AppClientID
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((conversation) => {
                const appClient = AppUtil.getAppClientByIdentifier(
                  props.conversation,
                  conversation.AppClientID
                )

                return (
                  <li
                    key={conversation.AppClientID}
                    className={`list-group-item ${
                      props.selectedAppClient === appClient ? 'active' : ''
                    }`}
                    onClick={() => {
                      props.setSelectedAppClient(appClient)
                      props.setConvo(conversation)
                      ClientInformationService.findClientInfoByIdentifier(conversation.AppClientID).then((data) => {
                        console.log("these are the client infos *chatleftside*:  " ,data)
                        props.setClientInformation(data)
                      }).catch((error) => {
                        console.error("Error fetching client information: ", error);
                      } )
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor:
                        props.selectedAppClient === appClient
                          ? '#e6f3f5'
                          : 'transparent',
                    }}
                  >
                    <div className='media'>
                      <div className='media-head'>
                        <div className='avatar avatar-sm avatar-rounded position-relative'>
                          <img
                            src={`https://avatar.iran.liara.run/username?username=${conversation.AppClientID}`}
                            alt='user'
                            className='avatar-img'
                          />
                          <span className='badge badge-success badge-indicator badge-indicator-lg position-bottom-end-overflow-1'></span>
                        </div>
                      </div>
                      <div className='media-body'>
                        <div>
                          <div className='user-name'>
                            {conversation.AppClientID}
                          </div>
                          <div className='user-last-chat'>
                            {conversation.messages.length > 0
                              ? conversation.messages[
                                  conversation.messages.length - 1
                                ].content
                              : 'No messages yet'}
                          </div>
                        </div>
                        <div>
                          <div className='last-chat-time'></div>
                          <div className='badge badge-primary badge-sm badge-pill'></div>
                          <div className='dropdown action-drp'>
                            <a
                              href='#'
                              className='btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret'
                              data-bs-toggle='dropdown'
                            >
                              <span className='icon'>
                                <span className='feather-icon'>
                                  <i data-feather='more-horizontal'></i>
                                </span>
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
          </ul>
        </div>
      </div>
    </>
  )
}
