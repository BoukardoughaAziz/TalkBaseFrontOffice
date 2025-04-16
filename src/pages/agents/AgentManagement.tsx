import { useEffect, useState } from 'react'
import axios from 'axios'

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
    <div className="hk-wrapper">
      <div className="hk-pg-wrapper">
        <div className="hk-pg-body">
          <div className="container-xxl">
            <div className="row">
              <div className="col-xl-10 col-lg-10 col-md-10 col-sm-10 position-relative mx-auto">
                <div className="auth-content py-md-0 py-8">
                  <div className="row">
                    <div className="col-lg-12 mx-auto">
                      <h4 className="mb-4">Agent Management</h4>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agents.map((agent) => (
                              <tr key={agent._id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={`https://avatar.iran.liara.run/public/${agent._id}`}
                                      alt={`${agent.firstname} ${agent.lastname}`}
                                      className="rounded-circle me-2"
                                      width="32"
                                      height="32"
                                    />
                                    <span>{agent.firstname} {agent.lastname}</span>
                                  </div>
                                </td>
                                <td>{agent.email}</td>
                                <td>{agent.type}</td>
                                <td>
                                  <span className={`badge ${agent.isApproved ? 'bg-success' : 'bg-warning'}`}>
                                    {agent.isApproved ? 'Approved' : 'Pending'}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className={`btn btn-sm ${agent.isApproved ? 'btn-danger' : 'btn-primary'}`}
                                    onClick={() => handleApproveAgent(agent._id)}
                                  >
                                    {agent.isApproved ? 'Revoke' : 'Approve'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}