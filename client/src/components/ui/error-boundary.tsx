import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ 
  title = "Something went wrong", 
  message = "We encountered an unexpected error. Please try again.", 
  onRetry 
}: ErrorDisplayProps) {
  return (
    <Card className="max-w-md mx-auto" data-testid="error-display">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <CardTitle className="text-destructive">{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent className="text-center">
          <Button onClick={onRetry} variant="outline" data-testid="button-retry">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      title="Connection Error"
      message="Unable to connect to server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}