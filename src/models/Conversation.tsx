import { ChatMessage } from './ChatMessage';

export interface Conversation {
    messages: ChatMessage[];
    AppClientID: string;
    AppAgentID:string
    isHandledBy_BB: boolean;  
}