import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, MessageSquare } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  showSmsNotification?: boolean;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  showSmsNotification = true,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-success">
        <div className="text-center">
          <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-xl font-semibold mb-2" data-testid="text-modal-title">{title}</h3>
          <p className="text-muted-foreground mb-6" data-testid="text-modal-message">{message}</p>
          
          {showSmsNotification && (
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium">SMS Notification Sent</p>
              </div>
              <p className="text-xs text-muted-foreground">
                A thank you message has been sent to your phone number.
              </p>
            </div>
          )}
          
          <Button 
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-close-modal"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
