
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
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-6 py-12 md:px-12">
      <div className="w-full max-w-5xl mx-auto">

        {/* Hero heading */}
        <div className="text-center mb-12">
          <h1 className="mx-auto max-w-4xl text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            AI-Powered Resume Optimization and Job Matching Platform
          </h1>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed mt-6">
            Understand your resume. Know your gaps. Build your career.
          </p>
        </div>

        {/* Resume upload */}
        <div className="max-w-3xl mx-auto">
          <UploadZone onFileSelect={handleFileSelect} file={file} />

          {fileError && (
            <p className="text-red-400 text-sm text-center mt-3">
              {fileError}
            </p>
          )}

          <button
            onClick={handleAnalyse}
            disabled={!file}
            className={`w-full mt-5 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              file
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Analyze My Resume →
          </button>

          <p className="text-center text-slate-500 text-sm mt-4">
            Supports PDF · Max 10MB
          </p>
        </div>

        {/* Features */}
        <div className="mt-14 border border-slate-700 rounded-2xl p-6 md:p-8">
          <p className="text-slate-500 text-xs font-semibold tracking-widest text-center mb-8">
            WHAT YOU'LL DISCOVER
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

            <div className="flex flex-col items-center">
              <div className="bg-indigo-900/50 p-3 rounded-xl mb-3">
                <FileText size={22} className="text-indigo-400" />
              </div>
              <div className="text-slate-200 text-base font-semibold mb-2">
                Resume Quality
              </div>
              <div className="text-slate-400 text-sm leading-relaxed max-w-xs">
                ATS and content analysis scored across six dimensions.
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-900/50 p-3 rounded-xl mb-3">
                <Briefcase size={22} className="text-green-400" />
              </div>
              <div className="text-slate-200 text-base font-semibold mb-2">
                Career Fit
              </div>
              <div className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Discover the best-fit roles based on your profile.
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-orange-900/50 p-3 rounded-xl mb-3">
                <BarChart2 size={22} className="text-orange-400" />
              </div>
              <div className="text-slate-200 text-base font-semibold mb-2">
                Skill Gaps
              </div>
              <div className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Find what to learn next with a priority roadmap.
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-center gap-2">
            <Pencil size={15} className="text-slate-500" />
            <p className="text-slate-400 text-sm text-center">
              Plus AI-written before-and-after improvements for weak resume bullets.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
