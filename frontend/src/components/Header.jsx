"use client"

import { useState } from "react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      style={{
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        padding: "1rem 0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(30, 41, 59, 0.95)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "var(--primary)",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.75rem",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                }}
              >
                H
              </span>
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              My Jobs
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: "flex",
              gap: "2rem",
              "@media (max-width: 768px)": {
                display: "none",
              },
            }}
          >
            <a
              href="#"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                padding: "0.5rem 0",
                borderBottom: "2px solid var(--primary)",
              }}
            >
              Jobs
            </a>
            <a
              href="#"
              style={{
                color: "var(--muted-foreground)",
                textDecoration: "none",
                fontSize: "0.875rem",
                padding: "0.5rem 0",
                transition: "color 0.2s ease",
              }}
            >
              Companies
            </a>
            <a
              href="#"
              style={{
                color: "var(--muted-foreground)",
                textDecoration: "none",
                fontSize: "0.875rem",
                padding: "0.5rem 0",
                transition: "color 0.2s ease",
              }}
            >
              About
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            style={{
              display: "none",
              "@media (max-width: 768px)": {
                display: "block",
              },
              background: "none",
              border: "none",
              color: "var(--foreground)",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            {isMenuOpen ? "×" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            style={{
              display: "block",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              "@media (min-width: 769px)": {
                display: "none",
              },
            }}
          >
            <a
              href="#"
              style={{
                display: "block",
                color: "var(--primary)",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Jobs
            </a>
            <a
              href="#"
              style={{
                display: "block",
                color: "var(--muted-foreground)",
                textDecoration: "none",
                fontSize: "0.875rem",
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Companies
            </a>
            <a
              href="#"
              style={{
                display: "block",
                color: "var(--muted-foreground)",
                textDecoration: "none",
                fontSize: "0.875rem",
                padding: "0.75rem 0",
              }}
            >
              About
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
