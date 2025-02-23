import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function AgentManagement() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/CallCenterAuthController/agents`
      )
      setAgents(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching agents:', error)
      setLoading(false)
    }
  }

  const handleApproveAgent = async (agentId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CallCenterAuthController/toggle-agent-approval`,
        { agentId }
      )
      await fetchAgents() // Refresh the list
    } catch (error) {
      console.error('Error toggling agent approval:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Agent Management</h2>
        <p className="text-muted-foreground">Approve or revoke agent access</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card key={agent._id} className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={`https://avatar.iran.liara.run/public/${agent._id}`}
                  alt={`${agent.firstname} ${agent.lastname}`}
                />
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">
                  {agent.firstname} {agent.lastname}
                </h3>
                <p className="text-sm text-muted-foreground">{agent.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={agent.isApproved ? "default" : "secondary"}>
                    {agent.isApproved ? 'Approved' : 'Pending'}
                  </Badge>
                  <Badge variant="outline">{agent.type}</Badge>
                </div>
              </div>
              <Button
                onClick={() => handleApproveAgent(agent._id)}
                variant={agent.isApproved ? "destructive" : "default"}
                size="sm"
              >
                {agent.isApproved ? 'Revoke' : 'Approve'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}