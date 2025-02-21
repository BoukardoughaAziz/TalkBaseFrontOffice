import { createLazyFileRoute } from '@tanstack/react-router'
import AgentManagement from '@/features/agents/AgentManagement'

export const Route = createLazyFileRoute('/mainDashboard/agentManagement/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AgentManagement />
}
