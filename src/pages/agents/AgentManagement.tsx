import { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle2, XCircle, Search, Filter, MoreVertical, Shield, AlertCircle } from 'lucide-react'

export default function AgentManagement() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedAgents, setSelectedAgents] = useState(new Set())

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
      await fetchAgents()
    } catch (error) {
      console.error('Error toggling agent approval:', error)
    }
  }

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'approved' && agent.isApproved) ||
                         (filterStatus === 'pending' && !agent.isApproved)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading agents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Agent Management</h1>
          </div>
          <p className="text-slate-600">Manage and approve agents in your call center</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-2">Total Agents</p>
            <p className="text-3xl font-bold text-slate-900">{agents.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-2">Approved</p>
            <p className="text-3xl font-bold text-green-600">{agents.filter(a => a.isApproved).length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-2">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{agents.filter(a => !a.isApproved).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {filteredAgents.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No agents found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAgents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://avatar.iran.liara.run/public/${agent._id}`}
                            alt={`${agent.firstname} ${agent.lastname}`}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                          />
                          <div>
                            <p className="font-medium text-slate-900">{agent.firstname} {agent.lastname}</p>
                            <p className="text-xs text-slate-500">{agent._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{agent.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {agent.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {agent.isApproved ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">Approved</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-600">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleApproveAgent(agent._id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            agent.isApproved
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          }`}
                        >
                          {agent.isApproved ? (
                            <>
                              <XCircle className="w-4 h-4" />
                              Revoke
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Showing {filteredAgents.length} of {agents.length} agents
        </div>
      </div>
    </div>
  )
}