import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsAppearance from '@/features/settings/appearance'

export const Route = createLazyFileRoute('/mainDashboard/settings/appearance')({
  component: SettingsAppearance,
})
