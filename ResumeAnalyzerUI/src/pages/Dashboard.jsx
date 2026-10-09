import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../context/AnalysisContext'
import ScoreTab from '../components/ScoreTab'
import SkillsTab from '../components/SkillsTab'
import RolesTab from '../components/RolesTab'
import ImprovementsTab from '../components/ImprovementsTab'

const TABS = ['Score', 'Skills & Gap', 'Roles', 'Improvements']

export default function Dashboard() {
  const navigate = useNavigate()
  const { scoreCard, fileName, clearAnalysis } = useAnalysis()
  const [activeTab, setActiveTab] = useState(0)
  const [gapRole, setGapRole] = useState(null)

  // Redirect to landing if no data (e.g. direct URL access or page refresh)
  useEffect(() => {
    if (!scoreCard) navigate('/')
  }, [scoreCard, navigate])

  const handleNewAnalysis = () => {
    clearAnalysis()
    navigate('/')
  }

  const handleSeeSkillGap = (role) => {
    setGapRole(role)
    setActiveTab(1)
  }

  if (!scoreCard) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-slate-400 flex-shrink-0">📄</span>
            <span className="text-slate-600 font-medium truncate">{fileName || 'Resume'}</span>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full text-sm font-semibold flex-shrink-0">
              {scoreCard.totalScore}/100
            </span>
          </div>
          <button
            onClick={handleNewAnalysis}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm flex-shrink-0 ml-4"
          >
            New Analysis ↑
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 flex">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-5 py-4 text-sm font-medium transition-colors ${
                activeTab === index
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content — all mounted to preserve gap data between tab switches */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className={activeTab !== 0 ? 'hidden' : ''}><ScoreTab /></div>
        <div className={activeTab !== 1 ? 'hidden' : ''}>
          <SkillsTab preSelectedRole={gapRole} />
        </div>
        <div className={activeTab !== 2 ? 'hidden' : ''}>
          <RolesTab onSeeSkillGap={handleSeeSkillGap} />
        </div>
        <div className={activeTab !== 3 ? 'hidden' : ''}><ImprovementsTab /></div>
      </div>
    </div>
  )
}
