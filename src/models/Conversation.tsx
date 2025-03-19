import { ChatMessage } from './ChatMessage';

export interface Conversation {
    messages: ChatMessage[];
    AppClientID: string;
    // connectedUsers?: string[];
}