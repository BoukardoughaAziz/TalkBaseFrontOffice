import {
  IconBrowserCheck,
  IconMessages,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Chats',
          url: '/mainDashboard/chats',
          badge: '3',
          icon: IconMessages,
        },
      ],
    },

    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/mainDashboard',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/mainDashboard/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/mainDashboard/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/mainDashboard/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/mainDashboard/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
      ],
    },
  ],
}
