"use client"

import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "var(--card)",
            border: "1px solid var(--destructive)",
            borderRadius: "var(--radius)",
            margin: "1rem",
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
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "var(--destructive)",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: "var(--muted-foreground)",
              marginBottom: "1.5rem",
              lineHeight: "1.5",
            }}
          >
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginRight: "1rem" }}>
            Refresh Page
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
          >
            Try Again
          </button>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details
              style={{
                marginTop: "2rem",
                textAlign: "left",
                backgroundColor: "var(--secondary)",
                padding: "1rem",
                borderRadius: "var(--radius)",
                fontSize: "0.75rem",
                color: "var(--muted-foreground)",
              }}
            >
              <summary style={{ cursor: "pointer", marginBottom: "0.5rem" }}>Error Details (Development Only)</summary>
              <pre style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
