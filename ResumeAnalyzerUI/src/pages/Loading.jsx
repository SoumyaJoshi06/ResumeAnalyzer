import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { uploadAndAnalyse } from '../api/resumeApi'
import { useAnalysis } from '../context/AnalysisContext'
import StepProgress, { STEPS } from '../components/StepProgress'

export default function Loading() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setAnalysisData } = useAnalysis()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(null)

  const file = location.state?.file

  useEffect(() => {
    if (!file) {
      navigate('/')
      return
    }

    // Fake step ticker — real data arrives in one API call
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < STEPS.length - 1) setCurrentStep(step)
    }, 2500)

    uploadAndAnalyse(file)
      .then((res) => {
        clearInterval(interval)
        setCurrentStep(STEPS.length)
        setAnalysisData(res.data, file.name)
        setTimeout(() => navigate('/dashboard'), 400)
      })
      .catch((err) => {
        clearInterval(interval)
        setError(err.response?.data?.message || 'Analysis failed. Please try again.')
      })

    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h2 className="text-white text-2xl font-semibold text-center mb-8">
          Analysing your resume...
        </h2>

        <div className="mb-8">
          <StepProgress currentStep={currentStep} />
        </div>

        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <p className="text-slate-500 text-sm text-center mt-4">
          Analyzing your resume. This may take a few moments...
        </p>
      </div>
    </div>
  )
}
