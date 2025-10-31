"use client"

import { useState, useEffect } from "react"

const JobForm = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    city: "",
    country: "",
    posting_date: "",
    job_type: "Full-Time",
    tags: "",
    salary: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        city: job.city || "",
        country: job.country || "",
        posting_date: job.posting_date || "",
        job_type: job.job_type || "Full-Time",
        tags: Array.isArray(job.tags) ? job.tags.join(", ") : job.tags || "",
        salary: job.salary || "",
      })
    }
  }, [job])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required"
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.posting_date) {
      newErrors.posting_date = "Posting date is required"
    } else {
      const selectedDate = new Date(formData.posting_date)
      const today = new Date()
      if (selectedDate > today) {
        newErrors.posting_date = "Posting date cannot be in the future"
      }
    }

    if (!["Full-Time", "Part-Time", "Contract", "Internship"].includes(formData.job_type)) {
      newErrors.job_type = "Please select a valid job type"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Process tags
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const submitData = {
        ...formData,
        tags: tags,
      }

      await onSubmit(submitData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      city: "",
      country: "",
      posting_date: "",
      job_type: "Full-Time",
      tags: "",
      salary: "",
    })
    setErrors({})
    onCancel()
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--foreground)",
          }}
        >
          {job ? "Edit Job" : "Add New Job"}
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "var(--muted-foreground)",
            cursor: "pointer",
            padding: "0.25rem",
          }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Job Title */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Job Title *
            </label>
            <input
              type="text"
              className="input"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. Senior Actuarial Analyst"
              style={{
                borderColor: errors.title ? "var(--destructive)" : "var(--border)",
              }}
            />
            {errors.title && (
              <p
                style={{
                  color: "var(--destructive)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Company */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Company *
            </label>
            <input
              type="text"
              className="input"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="e.g. Aon Corporation"
              style={{
                borderColor: errors.company ? "var(--destructive)" : "var(--border)",
              }}
            />
            {errors.company && (
              <p
                style={{
                  color: "var(--destructive)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.company}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Location *
            </label>
            <input
              type="text"
              className="input"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g. New York, NY, USA"
              style={{
                borderColor: errors.location ? "var(--destructive)" : "var(--border)",
              }}
            />
            {errors.location && (
              <p
                style={{
                  color: "var(--destructive)",
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {errors.location}
              </p>
            )}
          </div>

          {/* City and Country */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "var(--foreground)",
                }}
              >
                City
              </label>
              <input
                type="text"
                className="input"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g. New York"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "var(--foreground)",
                }}
              >
                Country
              </label>
              <input
                type="text"
                className="input"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="e.g. United States"
              />
            </div>
          </div>

          {/* Posting Date and Job Type */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "var(--foreground)",
                }}
              >
                Posting Date *
              </label>
              <input
                type="date"
                className="input"
                value={formData.posting_date}
                onChange={(e) => handleInputChange("posting_date", e.target.value)}
                style={{
                  borderColor: errors.posting_date ? "var(--destructive)" : "var(--border)",
                }}
              />
              {errors.posting_date && (
                <p
                  style={{
                    color: "var(--destructive)",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.posting_date}
                </p>
              )}
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "0.5rem",
                  color: "var(--foreground)",
                }}
              >
                Job Type *
              </label>
              <select
                className="select"
                value={formData.job_type}
                onChange={(e) => handleInputChange("job_type", e.target.value)}
                style={{
                  borderColor: errors.job_type ? "var(--destructive)" : "var(--border)",
                }}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
              {errors.job_type && (
                <p
                  style={{
                    color: "var(--destructive)",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {errors.job_type}
                </p>
              )}
            </div>
          </div>

          {/* Salary */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Salary (Optional)
            </label>
            <input
              type="text"
              className="input"
              value={formData.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              placeholder="e.g. $80,000 - $120,000"
            />
          </div>

          {/* Tags */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--foreground)",
              }}
            >
              Tags (Optional)
            </label>
            <input
              type="text"
              className="input"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="e.g. Life Insurance, Pricing, Python, Remote"
            />
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.75rem",
                marginTop: "0.25rem",
              }}
            >
              Separate multiple tags with commas
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Saving..." : job ? "Update Job" : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobForm
