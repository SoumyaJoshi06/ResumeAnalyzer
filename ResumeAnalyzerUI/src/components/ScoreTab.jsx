import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useAnalysis } from '../context/AnalysisContext'

const SECTION_LABELS = {
  atsKeywords: 'ATS Keywords',
  skillsRelevance: 'Skills Relevance',
  projectsExperience: 'Projects',
  impactQuantification: 'Impact / Numbers',
  roleAlignment: 'Role Alignment',
  clarityCompleteness: 'Clarity',
}

const getColor = (score, max = 100) => {
  const pct = (score / max) * 100
  if (pct >= 71) return '#22c55e'
  if (pct >= 51) return '#f97316'
  return '#ef4444'
}

export default function ScoreTab() {
  const { scoreCard } = useAnalysis()
  if (!scoreCard) return null

  const { totalScore, sections, strengths, criticalIssues } = scoreCard
  const ringColor = getColor(totalScore)

  return (
    <div className="space-y-6">
      {/* Score overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center justify-center min-w-[140px]">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={totalScore}
                text={`${totalScore}`}
                styles={buildStyles({
                  pathColor: ringColor,
                  textColor: ringColor,
                  trailColor: '#e2e8f0',
                  textSize: '22px',
                })}
              />
            </div>
            <p className="text-slate-400 text-sm mt-2">out of 100</p>
          </div>

          <div className="flex-1 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Strengths</h3>
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✅</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Issues to Fix</h3>
              <ul className="space-y-2">
                {criticalIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-orange-500 mt-0.5 flex-shrink-0">⚠</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-slate-700 mb-5">Section Breakdown</h3>
        <div className="space-y-5">
          {Object.entries(sections).map(([key, section]) => {
            const barColor = getColor(section.score, section.maxScore)
            const pct = (section.score / section.maxScore) * 100
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 font-medium">{SECTION_LABELS[key] || key}</span>
                  <span className="text-slate-500">
                    {section.score}/{section.maxScore}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{section.feedback}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
