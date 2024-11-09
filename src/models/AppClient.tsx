import { AppAgent } from "./AppAgent"
import AppBrowser from "./AppBrowser"
import AppOS from "./AppOS"

 
export class AppClient {
  identifier?: string

  humanIdentifier?: string

  appOS?: AppOS

  appBrowser?: AppBrowser

  ipAddress?: string

  city?: string

  org?: string

  countryCode?: string

  associatedAgent?: AppAgent
}
