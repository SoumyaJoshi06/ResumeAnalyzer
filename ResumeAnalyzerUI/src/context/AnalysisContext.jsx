import { createContext, useContext, useState } from 'react'

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [sessionId, setSessionId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [scoreCard, setScoreCard] = useState(null)
  const [improvements, setImprovements] = useState(null)
  const [matchedRoles, setMatchedRoles] = useState(null)
  const [fileName, setFileName] = useState(null)

  const setAnalysisData = (data, name) => {
    setSessionId(data.sessionId)
    setProfile(data.profile)
    setScoreCard(data.scoreCard)
    setImprovements(data.improvements)
    setMatchedRoles(data.matchedRoles)
    setFileName(name)
  }

  const clearAnalysis = () => {
    setSessionId(null)
    setProfile(null)
    setScoreCard(null)
    setImprovements(null)
    setMatchedRoles(null)
    setFileName(null)
  }

  return (
    <AnalysisContext.Provider
      value={{ sessionId, profile, scoreCard, improvements, matchedRoles, fileName, setAnalysisData, clearAnalysis }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

export const useAnalysis = () => useContext(AnalysisContext)
