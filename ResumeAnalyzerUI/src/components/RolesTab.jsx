import { useAnalysis } from '../context/AnalysisContext'

const getBarColor = (pct) => {
  if (pct >= 80) return 'bg-green-500'
  if (pct >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

export default function RolesTab({ onSeeSkillGap }) {
  const { matchedRoles } = useAnalysis()
  if (!matchedRoles) return null

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">Roles That Match Your Profile</h2>
      {matchedRoles.map((role) => (
        <div key={role.role} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-700">{role.role}</h3>
            <span className="text-slate-600 font-bold text-lg">{role.matchPercentage}%</span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(role.matchPercentage)}`}
              style={{ width: `${role.matchPercentage}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-3">
            {role.matchedSkills?.slice(0, 4).length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Matched</p>
                <div className="flex flex-wrap gap-1">
                  {role.matchedSkills.slice(0, 4).map((s) => (
                    <span key={s} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {role.missingSkills?.slice(0, 3).length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Missing</p>
                <div className="flex flex-wrap gap-1">
                  {role.missingSkills.slice(0, 3).map((s) => (
                    <span key={s} className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onSeeSkillGap(role.role)}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium transition-colors"
          >
            See Skill Gap →
          </button>
        </div>
      ))}
    </div>
  )
}
