import {
  IconBrowserCheck,
  IconMessages,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconRobot,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'
import { BarChart3, BarChart4 } from "lucide-react";
import { ChartNoAxesCombined } from 'lucide-react';



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
        {
          title: 'Analytics ',  
          url: "/mainDashboard/analytics",
          icon: BarChart3,
          
          
        },
        {
          
            title: "Statistics",
            url: "/mainDashboard/statistics",
            icon :ChartNoAxesCombined,
          
          
        },
        
        {
          title: 'Agent Management',
          url: '/mainDashboard/agentManagement',
          icon: IconRobot,
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
