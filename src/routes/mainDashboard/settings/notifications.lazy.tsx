import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsNotifications from '@/features/settings/notifications'

export const Route = createLazyFileRoute(
  '/mainDashboard/settings/notifications',
)({
  component: SettingsNotifications,
})
