import AgentType from "./AgentType";
import { Conversation } from "./Conversation";

export interface AppAgent {
    _id: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    type: AgentType;
    isApproved: boolean;
    emailVerified: boolean;
    emailPin: number;
    SocketId?: string;
    createdAt?: string;
    updatedAt?: string;
    Conversations?: Conversation[];

}