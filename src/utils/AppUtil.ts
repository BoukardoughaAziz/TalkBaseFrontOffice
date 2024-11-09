import AppBrowser from '@/models/AppBrowser'
import { AppClient } from '@/models/AppClient'
import { AppMap } from '@/components/AppMap'
import AppOS from '../models/AppOS'

export default class AppUtil {
  static getAppClientByIdentifier(
    conversation: AppMap<unknown, unknown>,
    appClientIdentifier: string
  ): AppClient {
    return conversation.getKeyMap().get(appClientIdentifier)
  }
  static getClientAppOsUrl(appOS?: AppOS) {
    if (appOS != null) {
      if (AppOS[appOS].toString() == 'Win') {
        return '/assets/img/win.png'
      }
      if (AppOS[appOS].toString() == 'Linux') {
        return '/assets/img/linux.png'
      }
      return '/assets/img/win.png'
    }

    return '/assets/img/win.png'
  }
  static getClientExplorerUrl(appBrowser?: AppBrowser) {
    if (appBrowser != null) {
      if (AppBrowser[appBrowser].toString() == 'FireFox') {
        return '/assets/img/firefox.png'
      }
      if (AppBrowser[appBrowser].toString() == 'Edge') {
        return '/assets/img/edge.png'
      }
      if (AppBrowser[appBrowser].toString() == 'Safari') {
        return '/assets/img/safari.png'
      }
      if (AppBrowser[appBrowser].toString() == 'Chrome') {
        return '/assets/img/chrome.png'
      }
    }

    return '/assets/img/chrome.png'
  }
}
