import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getCurrentLocation, reverseGeocode } from "@/lib/location";
import { MapPin, Loader2 } from "lucide-react";
import SuccessModal from "@/components/success-modal";
import { useLocation } from "wouter";

const formSchema = z.object({
  // Donor information
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  
  // Item details
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  quantity: z.string().optional(),
  
  // Pickup preferences
  pickupDate: z.string().optional(),
  pickupTimeSlot: z.string().optional(),
  pickupInstructions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function DonateItemsPage() {
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      category: "",
      condition: "",
      description: "",
      quantity: "",
      pickupDate: "",
      pickupTimeSlot: "",
      pickupInstructions: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { category, condition, description, quantity, pickupDate, pickupTimeSlot, pickupInstructions, ...donorData } = data;
      
      return apiRequest("POST", "/api/donations/items", {
        donor: donorData,
        item: { category, condition, description, quantity },
        pickup: { date: pickupDate, timeSlot: pickupTimeSlot, instructions: pickupInstructions },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      setShowSuccess(true);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetLocation = async () => {
    setLocationLoading(true);
    setLocationStatus("Getting location...");

    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.latitude, location.longitude);
      
      form.setValue("address", address);
      setLocationStatus(`Location found: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
      
      toast({
        title: "Location Found",
        description: "Address has been filled automatically. Please review and edit if needed.",
      });
    } catch (error: any) {
      setLocationStatus(error.message);
      toast({
        title: "Location Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLocationLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Donate Items</h1>
          <p className="text-muted-foreground mb-8" data-testid="text-page-description">
            Share your unused items to help those in need. Our team will coordinate pickup.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Donor Information */}
              <div>
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
              </div>

              {/* Item Details */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Item Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-category">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clothes">Clothes</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="medicines">Medicines</SelectItem>
                            <SelectItem value="food">Food Items</SelectItem>
                            <SelectItem value="toys">Toys</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-condition">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Item Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the items you want to donate..."
                          rows={3}
                          data-testid="textarea-description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Estimated Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5 shirts, 10 books, 1 bag of rice" data-testid="input-quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Details */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Pickup Location</h3>
                
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">Allow location access for easier pickup coordination</span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-get-location"
                  >
                    {locationLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Get Current Location
                  </Button>
                  {locationStatus && (
                    <p className="mt-2 text-sm text-muted-foreground" data-testid="text-location-status">
                      {locationStatus}
                    </p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter complete pickup address..."
                          rows={3}
                          data-testid="textarea-address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="City" data-testid="input-city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="State" data-testid="input-state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="000000" data-testid="input-pincode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pickup Preferences */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Pickup Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" data-testid="input-pickup-date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pickupTimeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time Slot</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-time-slot">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Any time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                            <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pickupInstructions"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions for our pickup team..."
                          rows={2}
                          data-testid="textarea-pickup-instructions"
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
                  disabled={submitMutation.isPending}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90"
                  data-testid="button-submit-donation"
                >
                  {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Submit Donation
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
        title="Item Donation Submitted!"
        message="Thank you for your generous donation. Our team will contact you shortly to arrange pickup."
      />
    </div>
  );
}
