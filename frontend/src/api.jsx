const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    return await handleResponse(response)
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

// Job API functions
export const fetchJobs = async (filters = {}) => {
  const queryParams = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value)
    }
  })

  const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  return apiRequest(endpoint)
}

export const fetchJob = async (jobId) => {
  return apiRequest(`/jobs/${jobId}`)
}

export const createJob = async (jobData) => {
  return apiRequest("/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  })
}

export const updateJob = async (jobId, jobData) => {
  return apiRequest(`/jobs/${jobId}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  })
}

export const deleteJob = async (jobId) => {
  return apiRequest(`/jobs/${jobId}`, {
    method: "DELETE",
  })
}

export const fetchJobStats = async () => {
  return apiRequest("/jobs/stats")
}

// Error handling utility
export const isApiError = (error) => {
  return error instanceof Error && error.message.includes("HTTP error")
}

export default {
  fetchJobs,
  fetchJob,
  createJob,
  updateJob,
  deleteJob,
  fetchJobStats,
  isApiError,
}
