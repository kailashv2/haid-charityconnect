import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessAnimationProps {
  className?: string;
  message?: string;
  showCheck?: boolean;
}

export function SuccessAnimation({ 
  className, 
  message = "Success!", 
  showCheck = true 
}: SuccessAnimationProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)} data-testid="success-animation">
      {showCheck && (
        <div className="relative">
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-8 h-8 text-secondary animate-bounce" />
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-secondary mt-4">{message}</h3>
    </div>
  );
}

export function DonationSuccess({ 
  type, 
  onContinue 
}: { 
  type: "items" | "money"; 
  onContinue?: () => void;
}) {
  const message = type === "items" 
    ? "Item donation submitted successfully!" 
    : "Payment processed successfully!";
    
  const subMessage = type === "items"
    ? "We'll contact you soon for pickup details."
    : "Thank you for your generous contribution!";

  return (
    <div className="text-center py-8" data-testid="donation-success">
      <SuccessAnimation message={message} />
      <p className="text-muted-foreground mt-2 mb-6">{subMessage}</p>
      {onContinue && (
        <button 
          onClick={onContinue}
          className="text-primary hover:underline"
          data-testid="button-continue-donating"
        >
          Make Another Donation
        </button>
      )}
    </div>
  );
}