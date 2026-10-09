import { useState, useEffect } from 'react'
import { useAnalysis } from '../context/AnalysisContext'
import { getSkillGap } from '../api/resumeApi'

export default function SkillsTab({ preSelectedRole }) {
  const { profile, matchedRoles, sessionId } = useAnalysis()
  const [selectedRole, setSelectedRole] = useState('')
  const [gapData, setGapData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const roles = matchedRoles?.map((r) => r.role) ?? []

  const fetchGap = async (role) => {
    if (!role || !sessionId) return
    setLoading(true)
    setError(null)
    try {
      const res = await getSkillGap(sessionId, role)
      setGapData(res.data)
    } catch {
      setError('Failed to load skill gap. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Auto-load on mount or when preSelectedRole changes
  useEffect(() => {
    const roleToLoad = preSelectedRole || roles[0]
    if (roleToLoad) {
      setSelectedRole(roleToLoad)
      fetchGap(roleToLoad)
    }
  }, [preSelectedRole])

  const handleRoleChange = (e) => {
    const role = e.target.value
    setSelectedRole(role)
    fetchGap(role)
  }

  return (
    <div className="space-y-6">
      {/* Skill chips */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-slate-700 mb-3">Your Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profile?.skills?.map((skill) => (
            <span key={skill} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Gap analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <h3 className="font-semibold text-slate-700">Skill Gap for:</h3>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {gapData && !loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <h4 className="text-green-700 font-semibold text-sm mb-2">✅ Strong</h4>
                <div className="space-y-1">
                  {gapData.strong?.map((s) => (
                    <div key={s} className="bg-green-50 text-green-700 text-sm px-3 py-1.5 rounded-lg">{s}</div>
                  ))}
                  {!gapData.strong?.length && <p className="text-slate-400 text-sm">None</p>}
                </div>
              </div>

              <div>
                <h4 className="text-orange-700 font-semibold text-sm mb-2">⚠ Partial</h4>
                <div className="space-y-1">
                  {gapData.partial?.map((s) => (
                    <div key={s} className="bg-orange-50 text-orange-700 text-sm px-3 py-1.5 rounded-lg">{s}</div>
                  ))}
                  {!gapData.partial?.length && <p className="text-slate-400 text-sm">None</p>}
                </div>
              </div>

              <div>
                <h4 className="text-red-700 font-semibold text-sm mb-2">❌ Missing</h4>
                <div className="space-y-1">
                  {gapData.missing?.map((s) => (
                    <div key={s} className="bg-red-50 text-red-700 text-sm px-3 py-1.5 rounded-lg">{s}</div>
                  ))}
                  {!gapData.missing?.length && <p className="text-slate-400 text-sm">None</p>}
                </div>
              </div>
            </div>

            {gapData.priorityLearning?.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-700 mb-3">Priority Learning</h4>
                <div className="space-y-2">
                  {gapData.priorityLearning.map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-4">
                      <p className="font-medium text-slate-700 text-sm">
                        {i + 1}. {item.skill}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">{item.reason}</p>
                      {item.resource && (
                        <p className="text-indigo-600 text-sm mt-1">→ {item.resource}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
