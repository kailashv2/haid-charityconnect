import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
      data-testid="loading-spinner"
      aria-label="Loading"
    />
  )
}

export function LoadingCard() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-2">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}