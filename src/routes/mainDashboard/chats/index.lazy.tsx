import { createLazyFileRoute } from '@tanstack/react-router'
import Chats from '@/features/chats/Chat'

export const Route = createLazyFileRoute('/mainDashboard/chats/')({
  component: Chats,
})
