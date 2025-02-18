import Chats from '@/features/chats/Chat'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/mainDashboard/')({
  component: Chats,
})
