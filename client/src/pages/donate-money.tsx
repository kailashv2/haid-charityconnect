import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Shield } from "lucide-react";
import SuccessModal from "@/components/success-modal";
import { useLocation } from "wouter";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const formSchema = z.object({
  // Donor information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  pan: z.string().optional(),
  
  // Donation details
  amount: z.number().min(1, "Amount must be at least ₹1"),
  purpose: z.string().min(1, "Purpose is required"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

function PaymentForm({ 
  formData, 
  onSuccess, 
  clientSecret 
}: { 
  formData: FormData; 
  onSuccess: () => void;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitPaymentMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      return apiRequest("POST", "/api/donations/money", {
        donor: formData,
        donation: {
          amount: formData.amount.toString(),
          purpose: formData.purpose,
          message: formData.message,
        },
        paymentIntentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Payment Processing Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await submitPaymentMutation.mutateAsync(paymentIntent.id);
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-secondary" />
          <span className="font-medium text-foreground">Secure Payment via Stripe</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your payment information is encrypted and secure. We accept all major credit/debit cards.
        </p>
      </div>

      <PaymentElement />

      <div className="border border-border rounded-lg p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Donation Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Donation Amount:</span>
            <span className="font-semibold" data-testid="text-amount-display">₹{formData.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee:</span>
            <span>₹0</span>
          </div>
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount:</span>
              <span data-testid="text-total-display">₹{formData.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || submitPaymentMutation.isPending}
        className="w-full bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90"
        data-testid="button-donate-securely"
      >
        {(isProcessing || submitPaymentMutation.isPending) && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Donate Securely
      </Button>
    </form>
  );
}

export default function DonateMoneyPage() {
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      pan: "",
      amount: 0,
      purpose: "general",
      message: "",
    },
  });

  const watchedAmount = form.watch("amount");

  useEffect(() => {
    if (watchedAmount !== selectedAmount) {
      setSelectedAmount(null);
    }
  }, [watchedAmount, selectedAmount]);

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { amount });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Setup Failed",
        description: error.message || "Failed to setup payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAmountSelect = (amount: number) => {
    form.setValue("amount", amount);
    setSelectedAmount(amount);
  };

  const onSubmit = (data: FormData) => {
    if (data.amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please select or enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (!stripePromise) {
      toast({
        title: "Payment Not Available",
        description: "Payment processing is currently not configured. Please contact the administrator.",
        variant: "destructive",
      });
      return;
    }
    
    createPaymentIntentMutation.mutate(data.amount);
  };

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    setShowPayment(false);
    form.reset();
  };

  if (showPayment && clientSecret) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Donation</h1>
            <p className="text-muted-foreground mb-8">
              You're about to donate ₹{form.getValues("amount").toLocaleString()} for {form.getValues("purpose")}.
            </p>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                formData={form.getValues()} 
                onSuccess={handlePaymentSuccess}
                clientSecret={clientSecret}
              />
            </Elements>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="px-8 py-3 rounded-lg font-semibold"
                data-testid="button-back-to-form"
              >
                Back to Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Donate Money</h1>
          <p className="text-muted-foreground mb-8" data-testid="text-page-description">
            Your monetary contribution helps us purchase essential items for those in need.
          </p>

          {/* Amount Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Select Amount</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-4 rounded-lg text-center font-semibold transition-all ${
                    selectedAmount === amount
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-primary hover:text-primary-foreground"
                  }`}
                  data-testid={`button-amount-${amount}`}
                >
                  ₹{amount.toLocaleString()}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Custom Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  type="number"
                  min="1"
                  className="pl-8"
                  placeholder="Enter amount"
                  value={watchedAmount || ""}
                  onChange={(e) => form.setValue("amount", parseInt(e.target.value) || 0)}
                  data-testid="input-custom-amount"
                />
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Donor Information */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Donor Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" data-testid="input-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 XXXXX XXXXX" data-testid="input-phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" data-testid="input-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>PAN Number (for tax receipt)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="AAAAA0000A" 
                          style={{ textTransform: 'uppercase' }}
                          data-testid="input-pan"
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Optional: Required for tax deduction receipt under Section 80G
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Donation Purpose */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Donation Purpose</h3>
                
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                          data-testid="radio-group-purpose"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="general" id="general" />
                            <Label htmlFor="general">General Fund - Use where most needed</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="food" id="food" />
                            <Label htmlFor="food">Food & Nutrition</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="education" id="education" />
                            <Label htmlFor="education">Education & Books</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="healthcare" id="healthcare" />
                            <Label htmlFor="healthcare">Healthcare & Medicines</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="shelter" id="shelter" />
                            <Label htmlFor="shelter">Shelter & Clothing</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Leave a message of hope..."
                          rows={3}
                          data-testid="textarea-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={createPaymentIntentMutation.isPending || watchedAmount <= 0}
                  className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90"
                  data-testid="button-proceed-to-payment"
                >
                  {createPaymentIntentMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Proceed to Payment
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="px-8 py-3 rounded-lg font-semibold"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setLocation("/");
        }}
        title="Payment Successful!"
        message="Your monetary donation has been processed successfully. Your contribution will make a real difference."
      />
    </div>
  );
}
