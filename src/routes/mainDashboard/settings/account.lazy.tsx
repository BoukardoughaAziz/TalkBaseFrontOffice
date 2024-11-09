import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsAccount from '@/features/settings/account'

export const Route = createLazyFileRoute('/mainDashboard/settings/account')({
  component: SettingsAccount,
})
