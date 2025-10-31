"use client"
import JobCard from "./JobCard"
import LoadingSpinner from "./LoadingSpinner"
import EmptyState from "./EmptyState"

const JobList = ({ jobs, loading, onEdit, onDelete }) => {
  if (loading) {
    return <LoadingSpinner message="Loading job listings..." />
  }

  if (jobs.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No jobs found"
        description="Try adjusting your filters or add some new job listings to get started."
        action={
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh Jobs
          </button>
        }
      />
    )
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          color: "var(--muted-foreground)",
          fontSize: "0.875rem",
          padding: "1rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
      </div>
    </div>
  )
}

export default JobList
