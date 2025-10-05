import { AppAgent } from "./AppAgent"
import { AppClient } from "./AppClient"
import ChatDirection from "./ChatDirection"
import ChatEvent from "./ChatEvent"
import { MessageReaction } from "./MessageReaction"
import { SenderType } from "./SenderType"


export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
  TYPING = 'typing'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}



export interface MessageAttachment {
  id: string
  filename: string
  fileSize: number
  mimeType: string
  url: string
  thumbnailUrl?: string
}


export class ChatMessage {
  message?: string
  chatDirection?: ChatDirection
  appClient?: AppClient
  appAgent?: AppAgent
  chatEvent?: ChatEvent
  senderType?:SenderType
  senderId: string 
  messageRecations?: MessageReaction
  conversationId?:string
  editedAt?: Date
  timestamp?:Date
  isSentBy_BB?: boolean;  
}
