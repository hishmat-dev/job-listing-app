"use client"

import { useEffect } from "react"

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const getToastStyles = () => {
    const baseStyles = {
      position: "fixed",
      top: "1rem",
      right: "1rem",
      padding: "1rem 1.5rem",
      borderRadius: "var(--radius)",
      color: "white",
      fontWeight: "500",
      fontSize: "0.875rem",
      zIndex: 1000,
      minWidth: "300px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }

    switch (type) {
      case "success":
        return {
          ...baseStyles,
          backgroundColor: "#22c55e",
        }
      case "error":
        return {
          ...baseStyles,
          backgroundColor: "#ef4444",
        }
      case "warning":
        return {
          ...baseStyles,
          backgroundColor: "#f59e0b",
        }
      case "info":
        return {
          ...baseStyles,
          backgroundColor: "#3b82f6",
        }
      default:
        return {
          ...baseStyles,
          backgroundColor: "#22c55e",
        }
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓"
      case "error":
        return "✕"
      case "warning":
        return "⚠"
      case "info":
        return "ℹ"
      default:
        return "✓"
    }
  }

  return (
    <div style={getToastStyles()}>
      <span style={{ fontSize: "1rem" }}>{getIcon()}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "1.25rem",
          cursor: "pointer",
          marginLeft: "auto",
          padding: "0",
          lineHeight: "1",
        }}
      >
        ×
      </button>
    </div>
  )
}

export default Toast
