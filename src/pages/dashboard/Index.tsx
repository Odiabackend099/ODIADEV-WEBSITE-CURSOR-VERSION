import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  source: string
  qualified: boolean
  score: number
  created_at: string
}

interface Conversation {
  id: string
  session_id: string
  message_count: number
  duration: string
  ended_at: string
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'leads' | 'conversations' | 'analytics'>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLeads([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+234 800 123 4567',
          source: 'website',
          qualified: true,
          score: 85,
          created_at: '2025-09-03T10:30:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@company.com',
          source: 'contact_form',
          qualified: false,
          score: 35,
          created_at: '2025-09-03T09:15:00Z'
        }
      ])
      
      setConversations([
        {
          id: '1',
          session_id: 'sess_123',
          message_count: 8,
          duration: '5m 32s',
          ended_at: '2025-09-03T11:00:00Z'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [])

  const tabs = [
    { id: 'leads', label: 'Leads', count: leads.length },
    { id: 'conversations', label: 'Conversations', count: conversations.length },
    { id: 'analytics', label: 'Analytics', count: null }
  ]

  return (
    <div className="min-h-screen pt-20 bg-mist/20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-medium text-navy mb-2">
            CRM Dashboard
          </h1>
          <p className="text-stone">
            Manage leads, conversations, and track your voice AI performance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-navy">{leads.length}</p>
              </div>
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone text-sm">Qualified Leads</p>
                <p className="text-2xl font-bold text-navy">{leads.filter(l => l.qualified).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone text-sm">Conversations</p>
                <p className="text-2xl font-bold text-navy">{conversations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-stone text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-navy">
                  {leads.length > 0 ? Math.round((leads.filter(l => l.qualified).length / leads.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm mb-6"
        >
          <div className="border-b border-mist/20">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-gold text-gold'
                      : 'border-transparent text-stone hover:text-navy hover:border-mist'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-mist text-stone px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'leads' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-navy">Recent Leads</h3>
                  <button className="btn-primary text-sm">
                    Export Leads
                  </button>
                </div>
                
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-mist/30 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 border border-mist/30 rounded-lg hover:bg-mist/10 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${lead.qualified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <div>
                            <p className="font-medium text-navy">{lead.name}</p>
                            <p className="text-sm text-stone">{lead.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-navy">Score: {lead.score}</p>
                          <p className="text-xs text-stone">{new Date(lead.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'conversations' && (
              <div>
                <h3 className="text-lg font-semibold text-navy mb-6">Recent Conversations</h3>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-mist/30 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="flex items-center justify-between p-4 border border-mist/30 rounded-lg hover:bg-mist/10 transition-colors">
                        <div>
                          <p className="font-medium text-navy">Session {conv.session_id}</p>
                          <p className="text-sm text-stone">{conv.message_count} messages • {conv.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-stone">{new Date(conv.ended_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-navy mb-6">Analytics Dashboard</h3>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-mist/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-stone">Analytics dashboard coming soon</p>
                  <p className="text-sm text-stone mt-2">Track conversion rates, response times, and user engagement</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
