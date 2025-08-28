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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, AlertCircle } from "lucide-react";
import SuccessModal from "@/components/success-modal";
import { useLocation } from "wouter";

const formSchema = z.object({
  // Needy person information
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(0, "Age must be 0 or greater").max(120, "Age must be valid"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().optional(),
  familySize: z.number().min(1, "Family size must be at least 1").optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  needs: z.array(z.string()).min(1, "At least one need must be selected"),
  situation: z.string().min(20, "Please provide a detailed description of the situation"),
  income: z.number().min(0, "Income must be 0 or greater").optional(),
  
  // Reporter information
  reporterName: z.string().min(2, "Reporter name must be at least 2 characters"),
  reporterPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  reporterEmail: z.string().email("Invalid email address"),
  reporterRelationship: z.string().min(1, "Relationship is required"),
  
  // Verification
  consent: z.boolean().refine(val => val === true, "You must agree to verification"),
});

type FormData = z.infer<typeof formSchema>;

const NEED_OPTIONS = [
  { id: "food", label: "Food & Nutrition" },
  { id: "clothing", label: "Clothing" },
  { id: "shelter", label: "Shelter" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "employment", label: "Employment" },
];

export default function RegisterNeedyPage() {
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "",
      phone: "",
      familySize: undefined,
      address: "",
      city: "",
      state: "",
      pincode: "",
      needs: [],
      situation: "",
      income: undefined,
      reporterName: "",
      reporterPhone: "",
      reporterEmail: "",
      reporterRelationship: "",
      consent: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { consent, ...submitData } = data;
      return apiRequest("POST", "/api/needy", submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      setShowSuccess(true);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register needy person. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Register Needy Person</h1>
          <p className="text-muted-foreground mb-8" data-testid="text-page-description">
            Help us identify and reach those who need assistance in your community.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" data-testid="input-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="120" 
                            placeholder="Age" 
                            data-testid="input-age"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-gender">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
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
                  name="familySize"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Family Size</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="Number of family members" 
                          data-testid="input-family-size"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Information */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Location Information</h3>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter complete address..."
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

              {/* Needs Assessment */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Needs Assessment</h3>
                
                <FormField
                  control={form.control}
                  name="needs"
                  render={() => (
                    <FormItem>
                      <FormLabel>Primary Needs (Select all that apply)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="checkbox-group-needs">
                        {NEED_OPTIONS.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="needs"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), option.id]
                                        : (field.value || []).filter((value) => value !== option.id);
                                      field.onChange(updatedValue);
                                    }}
                                    data-testid={`checkbox-need-${option.id}`}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="situation"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Current Situation *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the current situation and specific needs..."
                          rows={4}
                          data-testid="textarea-situation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Monthly Income (if any)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="Monthly income in ₹" 
                          data-testid="input-income"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Reporter Information */}
              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Reporter Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Information about the person submitting this registration
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="reporterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" data-testid="input-reporter-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reporterPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 XXXXX XXXXX" data-testid="input-reporter-phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reporterEmail"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Your Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" data-testid="input-reporter-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reporterRelationship"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Relationship to Needy Person *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-relationship">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="self">Self</SelectItem>
                          <SelectItem value="family">Family Member</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="neighbor">Neighbor</SelectItem>
                          <SelectItem value="social_worker">Social Worker</SelectItem>
                          <SelectItem value="ngo">NGO Representative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Verification */}
              <div className="border-t border-border pt-6">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Verification Note</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Our team will verify the information provided before adding the person to our assistance program. 
                        This may include a field visit or phone verification.
                      </p>
                      
                      <FormField
                        control={form.control}
                        name="consent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-consent"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm">
                                I confirm that the information provided is accurate to the best of my knowledge and I consent to verification by the HAID team.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90"
                  data-testid="button-submit-registration"
                >
                  {submitMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Submit Registration
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
        title="Registration Submitted!"
        message="The registration has been submitted for verification. Our team will review and contact you soon."
      />
    </div>
  );
}
