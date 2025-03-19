import { ChatMessage } from '@/models/ChatMessage';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

class ConversationService {
    async addMessageFromClientToAgent(incomingChatMessage: ChatMessage) {
        try {
            const response = await axios.post(`${BASE_URL}/api/chat/addMessageFromClientToAgent`, incomingChatMessage);
            return response.data;
        } catch (error) {
            console.error('Error adding message from client to agent:', error);
            throw error;
        }
    }

    async addMessageFromAgentToClient(incomingChatMessage: ChatMessage) {
        try {
            const response = await axios.post(`${BASE_URL}/api/chat/callcenter/addMessageFromAgentToClient`, incomingChatMessage);
            return response.data;
        } catch (error) {
            console.error('Error adding message from agent to client:', error);
            throw error;
        }
    }

    async getConversations() {
        try {
            const response = await axios.get(`${BASE_URL}/api/chat/callcenter/getAllConversations`);
            return response.data;
        } catch (error) {
            console.error('Error getting conversations:', error);
            throw error;
        }
    }

    async getConversationByAppClientID(AppClientID: string) {
        try {
            const response = await axios.get(`${BASE_URL}/api/chat/callcenter/findByAppClientID/${AppClientID}`);
            return response.data;
        } catch (error) {
            console.error(`Error finding conversation with AppClientID ${AppClientID}:`, error);
            throw error;
        }
    }

    async sayHi() {
        try {
            const response = await axios.get(`${BASE_URL}/api/chat/sayhi`);
            return response.data;
        } catch (error) {
            console.error('Error saying hi:', error);
            throw error;
        }
    }
}

export default new ConversationService();