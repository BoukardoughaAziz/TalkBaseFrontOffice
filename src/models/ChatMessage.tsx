import { AppClient } from "./AppClient"
import ChatDirection from "./ChatDirection"
import ChatEvent from "./ChatEvent"

 

export class ChatMessage {
  message?: string
  chatDirection?: ChatDirection

  chatEvent?: ChatEvent
  appClient?:AppClient
  identifier?:string
  timestamp?:Date
}
