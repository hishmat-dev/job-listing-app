const LoadingSpinner = ({ size = "medium", message = "Loading..." }) => {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: "20px", height: "20px" }
      case "large":
        return { width: "60px", height: "60px" }
      default:
        return { width: "40px", height: "40px" }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        color: "var(--muted-foreground)",
      }}
    >
      <div
        style={{
          ...getSizeStyles(),
          border: "3px solid var(--border)",
          borderTop: "3px solid var(--primary)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "1rem",
        }}
      />
      <p style={{ fontSize: "0.875rem", textAlign: "center" }}>{message}</p>
    </div>
  )
}

export default LoadingSpinner
