import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  LogOut,
  Eye,
  Phone,
  MapPin,
  Calendar,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NeedyPerson {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  city: string;
  needs: string[];
  urgencyLevel: string;
  description: string;
  status: string;
  verified: boolean;
  createdAt: string;
  reporterPhone: string;
  reporterName: string;
  reporterEmail: string;
  reporterRelationship: string;
}

export default function AdminDashboardPage() {
  const [, setLocation] = useLocation();
  const [selectedPerson, setSelectedPerson] = useState<NeedyPerson | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Fetch needy persons data
  const { data: needyPersons, isLoading, error } = useQuery({
    queryKey: ['/api/needy'],
    queryFn: async () => {
      const response = await fetch('/api/needy');
      if (!response.ok) {
        throw new Error('Failed to fetch needy persons');
      }
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Mutation for updating needy person status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'verify' | 'reject' }) => {
      const response = await fetch(`/api/needy/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Status Updated",
        description: `Request has been ${variables.action === 'verify' ? 'verified' : 'rejected'} successfully.`,
      });
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/needy'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUsername");
    // Trigger storage event for navigation update
    window.dispatchEvent(new Event('storage'));
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    // Force redirect to home page
    window.location.href = "/";
  };

  const handleVerify = (id: string) => {
    updateStatusMutation.mutate({ id, action: 'verify' });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({ id, action: 'reject' });
  };

  const getStatusBadge = (person: NeedyPerson) => {
    if (person.verified) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>;
    }
    if (person.status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-blue-100 text-blue-800"
    };
    return (
      <Badge className={`${colors[urgency as keyof typeof colors] || colors.medium} hover:bg-current`}>
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Priority
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-destructive">Failed to load data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const pendingRequests = (needyPersons as NeedyPerson[])?.filter(p => !p.verified && p.status !== 'rejected') || [];
  const verifiedRequests = (needyPersons as NeedyPerson[])?.filter(p => p.verified) || [];
  const rejectedRequests = (needyPersons as NeedyPerson[])?.filter(p => p.status === 'rejected') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and verify needy person registration requests
          </p>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <div className="text-3xl font-bold text-yellow-600">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : pendingRequests.length}
                </div>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <div className="text-3xl font-bold text-green-600">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : verifiedRequests.length}
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <div className="text-3xl font-bold text-red-600">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : rejectedRequests.length}
                </div>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <div className="text-3xl font-bold text-blue-600">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : (needyPersons as NeedyPerson[])?.length || 0}
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Requests ({pendingRequests.length})
          </CardTitle>
          <CardDescription>
            Review and approve or reject needy person registration requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{person.name}</h3>
                      <span className="text-sm text-muted-foreground">Age: {person.age}</span>
                      {getUrgencyBadge(person.urgencyLevel)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {person.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {person.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(person.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Needs:</strong> {person.needs.join(', ')}
                    </p>
                    <p className="text-sm">{person.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPerson(person)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {selectedPerson?.name}
                          </DialogTitle>
                          <DialogDescription>
                            Complete details of the registration request
                          </DialogDescription>
                        </DialogHeader>
                        {selectedPerson && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Name</Label>
                                <p className="text-sm text-muted-foreground">{selectedPerson.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Age</Label>
                                <p className="text-sm text-muted-foreground">{selectedPerson.age}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Phone</Label>
                                <p className="text-sm text-muted-foreground">{selectedPerson.phone}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">City</Label>
                                <p className="text-sm text-muted-foreground">{selectedPerson.city}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Address</Label>
                              <p className="text-sm text-muted-foreground">{selectedPerson.address}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Needs</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedPerson.needs.map((need, index) => (
                                  <Badge key={index} variant="secondary">{need}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Urgency Level</Label>
                              <div className="mt-1">
                                {getUrgencyBadge(selectedPerson.urgencyLevel)}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Description</Label>
                              <p className="text-sm text-muted-foreground">{selectedPerson.description}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Submitted</Label>
                              <p className="text-sm text-muted-foreground">
                                {new Date(selectedPerson.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      onClick={() => handleVerify(person.id)}
                      disabled={updateStatusMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button 
                      onClick={() => handleReject(person.id)}
                      disabled={updateStatusMutation.isPending}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Requests Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verified Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Verified Requests ({verifiedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {verifiedRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No verified requests yet.</p>
            ) : (
              <div className="space-y-3">
                {verifiedRequests.slice(0, 5).map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.city}</p>
                    </div>
                    {getStatusBadge(person)}
                  </div>
                ))}
                {verifiedRequests.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{verifiedRequests.length - 5} more verified requests
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rejected Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Rejected Requests ({rejectedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rejectedRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No rejected requests.</p>
            ) : (
              <div className="space-y-3">
                {rejectedRequests.slice(0, 5).map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.city}</p>
                    </div>
                    {getStatusBadge(person)}
                  </div>
                ))}
                {rejectedRequests.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{rejectedRequests.length - 5} more rejected requests
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
