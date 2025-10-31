"use client"

import { useState } from "react"
import DeleteConfirmation from "./DeleteConfirmation"

const JobCard = ({ job, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getJobTypeColor = (jobType) => {
    switch (jobType) {
      case "Full-Time":
        return "#22c55e"
      case "Part-Time":
        return "#f59e0b"
      case "Contract":
        return "#8b5cf6"
      case "Internship":
        return "#3b82f6"
      default:
        return "var(--muted-foreground)"
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete(job.id)
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error("Delete failed:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="card">
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                lineHeight: "1.4",
                marginBottom: "0.25rem",
                flex: 1,
                marginRight: "1rem",
              }}
            >
              {job.title}
            </h3>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexShrink: 0,
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => onEdit(job)}
                style={{
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
                }}
                title="Edit job"
              >
                Edit
              </button>
              <button
                className="btn btn-destructive"
                onClick={handleDeleteClick}
                style={{
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
                }}
                title="Delete job"
              >
                Delete
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "var(--primary)",
              }}
            >
              {job.company}
            </span>
            <span
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.875rem",
              }}
            >
              {job.location}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.5rem",
                backgroundColor: getJobTypeColor(job.job_type) + "20",
                color: getJobTypeColor(job.job_type),
                borderRadius: "0.25rem",
                fontSize: "0.75rem",
                fontWeight: "500",
              }}
            >
              {job.job_type}
            </span>

            <span
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.875rem",
              }}
            >
              Posted {formatDate(job.posting_date)}
            </span>
          </div>

          {job.salary && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "var(--secondary)",
                borderRadius: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--primary)",
                }}
              >
                💰 {job.salary}
              </span>
            </div>
          )}

          {job.tags && job.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="tag"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-foreground)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmation
          job={job}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}

export default JobCard
