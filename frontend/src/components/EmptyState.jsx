const EmptyState = ({
  icon = "📋",
  title = "No items found",
  description = "There are no items to display.",
  action = null,
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem 1rem",
        color: "var(--muted-foreground)",
      }}
    >
      <div
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          opacity: 0.6,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
          color: "var(--foreground)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          lineHeight: "1.5",
          marginBottom: action ? "1.5rem" : "0",
        }}
      >
        {description}
      </p>
      {action && action}
    </div>
  )
}

export default EmptyState
