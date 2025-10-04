import axios from 'axios'
import { ChatMessage } from '@/models/ChatMessage'

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
  async getConversationsByAgentId(agentId: string) {
    try {
    console.log("this is the agent id we're looking for conversations", agentId);
      const response = await axios.get(
        `${BASE_URL}/conversation/byAgent/${agentId}`
      )
      return response.data
    } catch (error) {
      console.error(`Error getting conversations by agentId ${agentId}:`, error)
      throw error
    }
  }
  async getConversations() {
    try {
      const response = await axios.get(
        `${BASE_URL}/conversation/getAllConversations`
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
        `${BASE_URL}/conversation/findByAppClientID/${AppClientID}`
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
