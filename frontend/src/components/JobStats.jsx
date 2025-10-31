"use client"

import { useState, useEffect } from "react"

const JobStats = ({ jobs }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (jobs.length > 0) {
      calculateStats()
    }
  }, [jobs])

  const calculateStats = () => {
    setLoading(true)

    // Calculate job type distribution
    const jobTypes = {}
    jobs.forEach((job) => {
      jobTypes[job.job_type] = (jobTypes[job.job_type] || 0) + 1
    })

    // Calculate top companies
    const companies = {}
    jobs.forEach((job) => {
      companies[job.company] = (companies[job.company] || 0) + 1
    })
    const topCompanies = Object.entries(companies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }))

    // Calculate top locations
    const locations = {}
    jobs.forEach((job) => {
      if (job.city) {
        locations[job.city] = (locations[job.city] || 0) + 1
      }
    })
    const topLocations = Object.entries(locations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }))

    // Calculate recent jobs (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentJobs = jobs.filter((job) => new Date(job.posting_date) >= thirtyDaysAgo).length

    setStats({
      total_jobs: jobs.length,
      job_types: Object.entries(jobTypes).map(([type, count]) => ({ type, count })),
      top_companies: topCompanies,
      top_locations: topLocations,
      recent_jobs: recentJobs,
    })

    setLoading(false)
  }

  if (loading || !stats) {
    return (
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div className="loading">Loading statistics...</div>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "var(--foreground)",
        }}
      >
        Job Market Overview
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Total Jobs */}
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            backgroundColor: "var(--secondary)",
            borderRadius: "var(--radius)",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--primary)",
              marginBottom: "0.5rem",
            }}
          >
            {stats.total_jobs}
          </div>
          <div
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.875rem",
            }}
          >
            Total Jobs
          </div>
        </div>

        {/* Recent Jobs */}
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            backgroundColor: "var(--secondary)",
            borderRadius: "var(--radius)",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#22c55e",
              marginBottom: "0.5rem",
            }}
          >
            {stats.recent_jobs}
          </div>
          <div
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.875rem",
            }}
          >
            Posted This Month
          </div>
        </div>

        {/* Job Types */}
        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--secondary)",
            borderRadius: "var(--radius)",
          }}
        >
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.75rem",
              color: "var(--foreground)",
            }}
          >
            Job Types
          </h4>
          {stats.job_types.map(({ type, count }) => (
            <div
              key={type}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--foreground)",
                }}
              >
                {type}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--primary)",
                }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>

        {/* Top Companies */}
        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--secondary)",
            borderRadius: "var(--radius)",
          }}
        >
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.75rem",
              color: "var(--foreground)",
            }}
          >
            Top Companies
          </h4>
          {stats.top_companies.map(({ company, count }) => (
            <div
              key={company}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--foreground)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginRight: "0.5rem",
                }}
              >
                {company}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--primary)",
                  flexShrink: 0,
                }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>

        {/* Top Locations */}
        <div
          style={{
            padding: "1rem",
            backgroundColor: "var(--secondary)",
            borderRadius: "var(--radius)",
          }}
        >
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              marginBottom: "0.75rem",
              color: "var(--foreground)",
            }}
          >
            Top Locations
          </h4>
          {stats.top_locations.map(({ city, count }) => (
            <div
              key={city}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--foreground)",
                }}
              >
                {city}
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "var(--primary)",
                }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default JobStats
