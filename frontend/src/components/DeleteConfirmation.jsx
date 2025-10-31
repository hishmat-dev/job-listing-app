"use client"

const DeleteConfirmation = ({ job, onConfirm, onCancel, isDeleting }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--card)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
          >
            ⚠️
          </div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "var(--foreground)",
            }}
          >
            Delete Job Listing
          </h3>
          <p
            style={{
              color: "var(--muted-foreground)",
              lineHeight: "1.5",
            }}
          >
            Are you sure you want to delete the job listing for{" "}
            <strong style={{ color: "var(--foreground)" }}>{job.title}</strong> at{" "}
            <strong style={{ color: "var(--foreground)" }}>{job.company}</strong>?
          </p>
          <p
            style={{
              color: "var(--destructive)",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
            }}
          >
            This action cannot be undone.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <button className="btn btn-secondary" onClick={onCancel} disabled={isDeleting} style={{ minWidth: "100px" }}>
            Cancel
          </button>
          <button
            className="btn btn-destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              minWidth: "100px",
              opacity: isDeleting ? 0.6 : 1,
              cursor: isDeleting ? "not-allowed" : "pointer",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmation
