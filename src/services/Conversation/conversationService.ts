import axios from 'axios'
import { ChatMessage } from '@/models/ChatMessage'

const BASE_URL = "http://localhost:15000"

class ConversationService {
  async addMessageFromClientToAgent(incomingChatMessage: ChatMessage) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/chat/widget/addMessageFromClientToAgent`,
        incomingChatMessage
      )
      return response.data
    } catch (error) {
      console.error('Error adding message from client to agent:', error)
      throw error
    }
  }

  async addMessageFromAgentToClient(incomingChatMessage: ChatMessage) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/chat/callcenter/addMessageFromAgentToClient`,
        incomingChatMessage
      )
      return response.data
    } catch (error) {
      console.error('Error adding message from agent to client:', error)
      throw error
    }
  }

  async getConversations() {
    try {
      const response = await axios.get(
        `${BASE_URL}/NwidgetBackend/conversation/getAllConversations`
      )
      return response.data
    } catch (error) {
      console.error('Error getting conversations:', error)
      throw error
    }
  }

  async getConversationByAppClientID(AppClientID: string) {
    try {
      const response = await axios.get(
        `${BASE_URL}/NwidgetBackend/conversation/findByAppClientID/${AppClientID}`
      )
      return response.data
    } catch (error) {
      console.error(
        `Error finding conversation with AppClientID ${AppClientID}:`,
        error
      )
      throw error
    }
  }

}

export default new ConversationService()
