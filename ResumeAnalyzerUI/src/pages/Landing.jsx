import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Briefcase, BarChart2, Pencil } from 'lucide-react'
import UploadZone from '../components/UploadZone'

export default function Landing() {
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const navigate = useNavigate()

  const handleFileSelect = (selected) => {
    if (selected.type === 'application/pdf') {
      setFile(selected)
      setFileError('')
    } else {
      setFile(null)
      setFileError('Only PDF files are accepted.')
    }
  }

  const handleAnalyse = () => {
    if (file) navigate('/loading', { state: { file } })
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ResumeIQ</h1>
          <p className="text-slate-400 text-lg">
            Understand your resume. Know your gaps. Build your career.
          </p>
        </div>

        <UploadZone onFileSelect={handleFileSelect} file={file} />

        {fileError && (
          <p className="text-red-400 text-sm text-center mt-2">{fileError}</p>
        )}

        <button
          onClick={handleAnalyse}
          disabled={!file}
          className={`w-full mt-4 py-3 px-6 rounded-xl font-semibold text-lg transition-all ${
            file
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Analyze My Resume →
        </button>

        <p className="text-center text-slate-500 text-sm mt-3">
          Supports PDF · Max 10MB
        </p>

        {/* 3-column workflow strip — shows the output journey, not fake data */}
        <div className="mt-10 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-500 text-xs font-semibold tracking-widest text-center mb-5">
            WHAT YOU'LL DISCOVER
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-indigo-900/50 p-2.5 rounded-lg mb-2">
                <FileText size={18} className="text-indigo-400" />
              </div>
              <div className="text-slate-200 text-sm font-medium mb-1">Resume Quality</div>
              <div className="text-slate-500 text-xs leading-snug">
                ATS & content analysis scored across 6 dimensions
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-900/50 p-2.5 rounded-lg mb-2">
                <Briefcase size={18} className="text-green-400" />
              </div>
              <div className="text-slate-200 text-sm font-medium mb-1">Career Fit</div>
              <div className="text-slate-500 text-xs leading-snug">
                Best-fit roles matched to your profile
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-900/50 p-2.5 rounded-lg mb-2">
                <BarChart2 size={18} className="text-orange-400" />
              </div>
              <div className="text-slate-200 text-sm font-medium mb-1">Skill Gaps</div>
              <div className="text-slate-500 text-xs leading-snug">
                What to learn next, with a priority roadmap
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-center gap-2">
            <Pencil size={13} className="text-slate-500" />
            <p className="text-slate-500 text-xs">Plus AI-written before/after improvements for every weak bullet</p>
          </div>
        </div>
      </div>
    </div>
  )
}
