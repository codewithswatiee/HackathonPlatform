
const variantStyles = {
  default: "bg-zinc-800 text-white",
  secondary: "bg-zinc-700 text-zinc-200",
  destructive: "bg-red-500 text-white",
  outline: "border border-zinc-700 text-zinc-200",
  success: "bg-green-600 text-white",
}

const sizeStyles = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
}

function Badge({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  const variantStyle = variantStyles[variant] || variantStyles.default
  const sizeStyle = sizeStyles[size] || sizeStyles.default

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyle} ${sizeStyle} ${className || ""}`}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
