"use client"

import { useState, useEffect } from "react"
import "./App.css"
import JobList from "./components/JobList"
import JobForm from "./components/JobForm"
import FilterBar from "./components/FilterBar"
import Header from "./components/Header"
import Toast from "./components/Toast"
import ErrorBoundary from "./components/ErrorBoundary"
import JobStats from "./components/JobStats"
import { fetchJobs, createJob, updateJob, deleteJob } from "./api"

function App() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [showStats, setShowStats] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    job_type: "",
    location: "",
    city: "",
    country: "",
    tag: "",
    date_range: "",
    sort: "posting_date_desc",
  })

  // Fetch jobs on component mount
  useEffect(() => {
    loadJobs()
  }, [])

  // Apply filters when jobs or filters change
  useEffect(() => {
    applyFilters()
  }, [jobs, filters])

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchJobs()
      setJobs(response.jobs || [])
    } catch (err) {
      const errorMessage = "Failed to load jobs. Please check your connection and try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
      console.error("Error loading jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...jobs]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.location.toLowerCase().includes(searchTerm) ||
          (job.tags && job.tags.some((tag) => tag.toLowerCase().includes(searchTerm))),
      )
    }

    // Apply job type filter
    if (filters.job_type) {
      filtered = filtered.filter((job) => job.job_type === filters.job_type)
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Apply city filter
    if (filters.city) {
      filtered = filtered.filter((job) => job.city === filters.city)
    }

    // Apply country filter
    if (filters.country) {
      filtered = filtered.filter((job) => job.country === filters.country)
    }

    // Apply tag filter
    if (filters.tag) {
      filtered = filtered.filter((job) => job.tags && job.tags.includes(filters.tag))
    }

    // Apply date range filter
    if (filters.date_range) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.posting_date)

        switch (filters.date_range) {
          case "today":
            return jobDate >= today
          case "week":
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return jobDate >= weekAgo
          case "month":
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            return jobDate >= monthAgo
          case "3months":
            const threeMonthsAgo = new Date(today)
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
            return jobDate >= threeMonthsAgo
          default:
            return true
        }
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case "posting_date_desc":
          return new Date(b.posting_date) - new Date(a.posting_date)
        case "posting_date_asc":
          return new Date(a.posting_date) - new Date(b.posting_date)
        case "title_asc":
          return a.title.localeCompare(b.title)
        case "title_desc":
          return b.title.localeCompare(a.title)
        case "company_asc":
          return a.company.localeCompare(b.company)
        case "company_desc":
          return b.company.localeCompare(a.company)
        default:
          return new Date(b.posting_date) - new Date(a.posting_date)
      }
    })

    setFilteredJobs(filtered)
  }

  const handleCreateJob = async (jobData) => {
    try {
      setError(null)
      const newJob = await createJob(jobData)
      setJobs((prevJobs) => [newJob, ...prevJobs])
      setShowJobForm(false)
      showToast("Job created successfully!", "success")
    } catch (err) {
      const errorMessage = err.message || "Failed to create job. Please check your input and try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
      console.error("Error creating job:", err)
    }
  }

  const handleUpdateJob = async (jobId, jobData) => {
    try {
      setError(null)
      const updatedJob = await updateJob(jobId, jobData)
      setJobs((prevJobs) => prevJobs.map((job) => (job.id === jobId ? updatedJob : job)))
      setEditingJob(null)
      setShowJobForm(false)
      showToast("Job updated successfully!", "success")
    } catch (err) {
      const errorMessage = err.message || "Failed to update job. Please check your input and try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
      console.error("Error updating job:", err)
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      setError(null)
      await deleteJob(jobId)
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
      showToast("Job deleted successfully!", "success")
    } catch (err) {
      const errorMessage = err.message || "Failed to delete job. Please try again."
      setError(errorMessage)
      showToast(errorMessage, "error")
      console.error("Error deleting job:", err)
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setShowJobForm(true)
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))
  }

  const handleCloseForm = () => {
    setShowJobForm(false)
    setEditingJob(null)
  }

  const handleRetry = () => {
    setError(null)
    loadJobs()
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <Header />

        <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
          {/* Error Display */}
          {error && (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid var(--destructive)",
                borderRadius: "var(--radius)",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "1.25rem", marginRight: "0.75rem" }}>⚠️</span>
                <div>
                  <div style={{ color: "var(--destructive)", fontWeight: "500" }}>{error}</div>
                  <div style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    Please check your internet connection or try again later.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleRetry}
                  style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                >
                  Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--destructive)",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    padding: "0.25rem",
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Actuarial Job Listings
                </h1>
                <p
                  style={{
                    color: "var(--muted-foreground)",
                    fontSize: "1.125rem",
                    lineHeight: "1.6",
                  }}
                >
                  Find your next opportunity in the actuarial field
                </p>
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowStats(!showStats)}
                  style={{ padding: "0.75rem 1.5rem" }}
                >
                  {showStats ? "Hide Stats" : "Show Stats"}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowJobForm(true)}
                  style={{ padding: "0.75rem 1.5rem" }}
                >
                  Add New Job
                </button>
              </div>
            </div>

            {/* Job Statistics */}
            {showStats && <JobStats jobs={jobs} />}

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              jobCount={filteredJobs.length}
              jobs={jobs}
            />
          </div>

          {/* Job Form Modal */}
          {showJobForm && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "1rem",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{
                  backgroundColor: "var(--card)",
                  borderRadius: "var(--radius)",
                  padding: "2rem",
                  maxWidth: "600px",
                  width: "100%",
                  maxHeight: "90vh",
                  overflow: "auto",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <JobForm
                  job={editingJob}
                  onSubmit={editingJob ? (data) => handleUpdateJob(editingJob.id, data) : handleCreateJob}
                  onCancel={handleCloseForm}
                />
              </div>
            </div>
          )}

          {/* Job List */}
          <JobList jobs={filteredJobs} loading={loading} onEdit={handleEditJob} onDelete={handleDeleteJob} />
        </main>

        {/* Toast Notifications */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      </div>
    </ErrorBoundary>
  )
}

export default App
