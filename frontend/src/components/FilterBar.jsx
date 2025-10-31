"use client"

import { useState, useEffect } from "react"

const FilterBar = ({ filters, onFilterChange, jobCount, jobs = [] }) => {
  const [availableLocations, setAvailableLocations] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Extract unique locations and tags from jobs
  useEffect(() => {
    if (jobs.length > 0) {
      // Get unique cities
      const cities = [...new Set(jobs.map((job) => job.city).filter(Boolean))]
      setAvailableLocations(cities.sort())

      // Get unique tags
      const allTags = jobs.flatMap((job) => job.tags || [])
      const uniqueTags = [...new Set(allTags)].filter(Boolean)
      setAvailableTags(uniqueTags.sort())
    }
  }, [jobs])

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: "",
      job_type: "",
      location: "",
      city: "",
      country: "",
      tag: "",
      sort: "posting_date_desc",
    })
  }

  const hasActiveFilters =
    filters.search || filters.job_type || filters.location || filters.city || filters.country || filters.tag

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters)
  }

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.5rem",
      }}
    >
      {/* Basic Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1rem",
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
            Search Jobs
          </label>
          <input
            type="text"
            className="input"
            placeholder="Search by title, company, or location..."
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
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
            Job Type
          </label>
          <select
            className="select"
            value={filters.job_type}
            onChange={(e) => handleInputChange("job_type", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
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
            Location
          </label>
          <input
            type="text"
            className="input"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
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
            Sort By
          </label>
          <select className="select" value={filters.sort} onChange={(e) => handleInputChange("sort", e.target.value)}>
            <option value="posting_date_desc">Newest First</option>
            <option value="posting_date_asc">Oldest First</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
            <option value="company_asc">Company A-Z</option>
            <option value="company_desc">Company Z-A</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          className="btn btn-secondary"
          onClick={toggleAdvancedFilters}
          style={{
            fontSize: "0.875rem",
            padding: "0.5rem 1rem",
          }}
        >
          {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
            padding: "1rem",
            backgroundColor: "var(--secondary)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
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
            <select
              className="select"
              value={filters.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
            >
              <option value="">All Cities</option>
              {availableLocations.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
            <select
              className="select"
              value={filters.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
            >
              <option value="">All Countries</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
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
              Tags
            </label>
            <select
              className="select"
              value={filters.tag || ""}
              onChange={(e) => handleInputChange("tag", e.target.value)}
            >
              <option value="">All Tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
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
              Date Range
            </label>
            <select
              className="select"
              value={filters.date_range || ""}
              onChange={(e) => handleInputChange("date_range", e.target.value)}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="3months">Last 3 Months</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "1rem",
            backgroundColor: "var(--accent)",
            borderRadius: "var(--radius)",
            color: "var(--accent-foreground)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Active Filters:</span>
            <button
              className="btn"
              onClick={clearFilters}
              style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "var(--accent-foreground)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              Clear All
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {filters.search && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                }}
              >
                Search: "{filters.search}"
              </span>
            )}
            {filters.job_type && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                }}
              >
                Type: {filters.job_type}
              </span>
            )}
            {filters.location && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                }}
              >
                Location: {filters.location}
              </span>
            )}
            {filters.city && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                }}
              >
                City: {filters.city}
              </span>
            )}
            {filters.country && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                }}
              >
                Country: {filters.country}
              </span>
            )}
            {filters.tag && (
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.25rem",
                  fontSize: "0.75rem",
                }}
              >
                Tag: {filters.tag}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
          }}
        >
          {jobCount} job{jobCount !== 1 ? "s" : ""} found
          {hasActiveFilters && <span style={{ color: "var(--primary)" }}> (filtered)</span>}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.75rem",
            }}
          >
            Sort:{" "}
            {filters.sort === "posting_date_desc"
              ? "Newest First"
              : filters.sort === "posting_date_asc"
                ? "Oldest First"
                : filters.sort === "title_asc"
                  ? "Title A-Z"
                  : filters.sort === "title_desc"
                    ? "Title Z-A"
                    : filters.sort === "company_asc"
                      ? "Company A-Z"
                      : filters.sort === "company_desc"
                        ? "Company Z-A"
                        : "Default"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
