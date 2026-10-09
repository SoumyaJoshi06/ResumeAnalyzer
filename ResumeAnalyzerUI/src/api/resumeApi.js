import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

export const uploadAndAnalyse = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post(`${BASE_URL}/api/resume/analyse`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getSkillGap = (sessionId, role) => {
  return axios.post(`${BASE_URL}/api/analyse/${sessionId}/gap`, { role })
}

export const getRoles = () => {
  return axios.get(`${BASE_URL}/api/analyse/roles`)
}
