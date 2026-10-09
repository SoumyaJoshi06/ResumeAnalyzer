import { useState } from 'react'
import { useAnalysis } from '../context/AnalysisContext'

export default function ImprovementsTab() {
  const { improvements } = useAnalysis()
  const [copied, setCopied] = useState(null)

  if (!improvements) return null

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-700">
        How to make your resume stronger{' '}
        <span className="text-slate-400 font-normal text-sm">
          — AI found {improvements.length} areas to improve
        </span>
      </h2>

      {improvements.map((item, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 tracking-widest mb-4">
            SUGGESTION {i + 1}
          </p>

          <div className="mb-3">
            <p className="text-xs font-semibold text-red-400 mb-1">BEFORE</p>
            <div className="bg-red-50 border border-red-100 rounded-lg p-3">
              <p className="text-red-600 text-sm line-through">{item.original}</p>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-green-500">AFTER</p>
              <button
                onClick={() => handleCopy(item.improved, i)}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                {copied === i ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-3">
              <p className="text-green-700 text-sm font-medium">{item.improved}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">{item.reason}</p>
        </div>
      ))}
    </div>
  )
}
