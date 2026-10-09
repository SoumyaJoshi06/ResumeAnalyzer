export const STEPS = [
  'Reading your resume',
  'Extracting skills & experience',
  'Evaluating resume quality',
  'Identifying skill gaps',
  'Matching career roles',
]

export default function StepProgress({ currentStep }) {
  return (
    <div className="space-y-4">
      {STEPS.map((step, index) => {
        const done = index < currentStep
        const active = index === currentStep
        return (
          <div key={step} className="flex items-center gap-3">
            <span className="text-xl w-6 flex-shrink-0">
              {done ? '✅' : active ? '⏳' : '○'}
            </span>
            <span
              className={`text-base ${
                done ? 'text-green-400' : active ? 'text-white' : 'text-slate-500'
              }`}
            >
              {step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
