import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, CheckCircle, XCircle, Clock, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  reporterPhone?: string;
  reporterName?: string;
}

export default function AdminDashboardSimple() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if admin is logged in (only on component mount, not on every render)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      setLocation("/admin/login");
    }
  }, []); // Empty dependency array - only runs once on mount

  // Fetch needy persons data
  const { data: needyPersons = [], isLoading, error } = useQuery({
    queryKey: ['needy-persons'],
    queryFn: async () => {
      const response = await fetch('/api/needy');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    },
    refetchInterval: 5000,
  });

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'verify' | 'reject' | 'helped' | 'unhelp' | 'unverify' | 'unreject' }) => {
      console.log(`🔄 Starting ${action} action for person ID: ${id}`);
      
      const response = await fetch(`/api/needy/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log(`📡 API Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to ${action}: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`✅ API Success:`, result);
      return result;
    },
    onSuccess: (data, variables) => {
      // Show success toast
      toast({
        title: "Success!",
        description: `Person has been ${variables.action}ed successfully. SMS notification sent.`,
      });
      
      // Immediately refresh the data to show real-time updates
      queryClient.invalidateQueries({ queryKey: ['needy-persons'] });
      
      // Also refresh analytics data to update home page and analytics page
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      
      console.log(`✅ Real database update: Person ${variables.action}ed successfully`, data);
    },
    onError: (error, variables) => {
      // Show error toast
      toast({
        title: "Error",
        description: `Failed to ${variables.action} person. Please try again.`,
        variant: "destructive",
      });
      
      console.error(`❌ Database update failed: Could not ${variables.action} person`, error);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUsername");
    // Trigger storage event for navigation update
    window.dispatchEvent(new Event('storage'));
    // Force redirect to home page
    window.location.href = "/";
  };

  const handleVerify = (id: string) => {
    updateStatusMutation.mutate({ id, action: 'verify' });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({ id, action: 'reject' });
  };

  const handleMarkAsHelped = (id: string) => {
    updateStatusMutation.mutate({ id, action: 'helped' });
  };

  const handleRemoveFromHelped = (id: string) => {
    updateStatusMutation.mutate({ id, action: 'unhelp' });
  };

  const handleRemoveFromVerified = (id: string) => {
    updateStatusMutation.mutate({ id, action: 'unverify' });
  };

  const handleRemoveFromRejected = (id: string) => {
    updateStatusMutation.mutate({ id, action:'unreject' });
  };


  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-red-600">Failed to load data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const pendingRequests = needyPersons.filter((p: NeedyPerson) => !p.verified && p.status !== 'rejected');
  const verifiedRequests = needyPersons.filter((p: NeedyPerson) => p.verified);
  const rejectedRequests = needyPersons.filter((p: NeedyPerson) => p.status === 'rejected');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Admin Dashboard
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">🟢 Live Database</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and verify needy person registration requests • Connected to PostgreSQL
          </p>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span>📊 Total Records: {needyPersons.length}</span>
            <span>🔄 Auto-refresh: 5s</span>
            <span>⏰ Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
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
                <p className="text-sm text-gray-600">Pending Requests</p>
                <div className="text-3xl font-bold text-yellow-600">
                  {isLoading ? '...' : pendingRequests.length}
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
                <p className="text-sm text-gray-600">Verified</p>
                <div className="text-3xl font-bold text-green-600">
                  {isLoading ? '...' : verifiedRequests.length}
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
                <p className="text-sm text-gray-600">Rejected</p>
                <div className="text-3xl font-bold text-red-600">
                  {isLoading ? '...' : rejectedRequests.length}
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
                <p className="text-sm text-gray-600">Total Requests</p>
                <div className="text-3xl font-bold text-blue-600">
                  {isLoading ? '...' : needyPersons.length}
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Requests ({pendingRequests.length})
            {isLoading && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Updating...</span>}
          </CardTitle>
          <CardDescription>
            Review and approve or reject needy person registration requests • Real-time database updates every 5 seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((person: NeedyPerson) => (
                <div key={person.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{person.name}</h3>
                      <span className="text-sm text-gray-500">Age: {person.age}</span>
                      <Badge variant="secondary">{person.urgencyLevel} Priority</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>📞 {person.phone}</span>
                      <span>📍 {person.city}</span>
                      <span>📅 {new Date(person.createdAt).toLocaleDateString()}</span>
                      <span>🕒 {new Date(person.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Needs:</strong> {person.needs.join(', ')}
                    </p>
                    <p className="text-sm">{person.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!person.verified ? (
                      <>
                        <Button 
                          onClick={() => handleVerify(person.id)}
                          disabled={updateStatusMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {updateStatusMutation.isPending ? 'Processing...' : 'Verify'}
                        </Button>
                        <Button 
                          onClick={() => handleReject(person.id)}
                          disabled={updateStatusMutation.isPending}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          {updateStatusMutation.isPending ? 'Processing...' : 'Reject'}
                        </Button>
                      </>
                    ) : person.status !== 'helped' ? (
                      <Button 
                        onClick={() => handleMarkAsHelped(person.id)}
                        disabled={updateStatusMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {updateStatusMutation.isPending ? 'Processing...' : 'Mark as Helped'}
                      </Button>
                    ) : (
                      <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded text-sm font-medium">
                        ✅ Helped
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verified People (Ready to Help) */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Verified People ({needyPersons.filter((p: NeedyPerson) => p.verified && p.status !== 'helped').length})
          </CardTitle>
          <CardDescription>
            Verified people ready to receive help • Click "Mark as Helped" when assistance is provided
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading verified people...</div>
          ) : needyPersons.filter((p: NeedyPerson) => p.verified && p.status !== 'helped').length === 0 ? (
            <div className="text-center py-8 text-gray-500">No verified people waiting for help</div>
          ) : (
            <div className="space-y-4">
              {needyPersons.filter((p: NeedyPerson) => p.verified && p.status !== 'helped').map((person: NeedyPerson) => (
                <div key={person.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <span className="text-sm text-gray-500">Age: {person.age}</span>
                        <Badge className="bg-green-100 text-green-600">✓ Verified</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>📞 {person.phone}</span>
                        <span>📍 {person.city}</span>
                        <span>📅 {new Date(person.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Needs:</strong> {person.needs.join(', ')}
                      </p>
                      <p className="text-sm">{person.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        onClick={() => handleMarkAsHelped(person.id)}
                        disabled={updateStatusMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        {updateStatusMutation.isPending ? 'Processing...' : 'Mark as Helped'}
                      </Button>
                      <Button 
                        onClick={() => handleRemoveFromVerified(person.id)}
                        disabled={updateStatusMutation.isPending}
                        variant="outline"
                        className="bg-green-100 text-green-600 border-green-300 hover:bg-green-200"
                        size="sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                        {updateStatusMutation.isPending ? 'Processing...' : 'Remove Verified'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejected People */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Rejected People ({needyPersons.filter((p: NeedyPerson) => p.status === 'rejected').length})
          </CardTitle>
          <CardDescription>
            People whose requests have been rejected • Click "Remove Rejected" to move back to pending
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading rejected people...</div>
          ) : needyPersons.filter((p: NeedyPerson) => p.status === 'rejected').length === 0 ? (
            <div className="text-center py-8 text-gray-500">No rejected people</div>
          ) : (
            <div className="space-y-4">
              {needyPersons.filter((p: NeedyPerson) => p.status === 'rejected').map((person: NeedyPerson) => (
                <div key={person.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <span className="text-sm text-gray-500">Age: {person.age}</span>
                        <Badge className="bg-red-100 text-red-600">❌ Rejected</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>📞 {person.phone}</span>
                        <span>📍 {person.city}</span>
                        <span>📅 {new Date(person.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Needs:</strong> {person.needs.join(', ')}
                      </p>
                      <p className="text-sm">{person.description}</p>
                    </div>
                    <Button 
                      onClick={() => handleRemoveFromRejected(person.id)}
                      disabled={updateStatusMutation.isPending}
                      variant="outline"
                      className="bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
                      size="sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      {updateStatusMutation.isPending ? 'Processing...' : 'Remove Rejected'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Helped People */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            People Helped ({needyPersons.filter((p: NeedyPerson) => p.status === 'helped').length})
          </CardTitle>
          <CardDescription>
            People who have successfully received assistance through the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading helped people...</div>
          ) : needyPersons.filter((p: NeedyPerson) => p.status === 'helped').length === 0 ? (
            <div className="text-center py-8 text-gray-500">No people have been helped yet</div>
          ) : (
            <div className="space-y-4">
              {needyPersons.filter((p: NeedyPerson) => p.status === 'helped').map((person: NeedyPerson) => (
                <div key={person.id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <span className="text-sm text-gray-500">Age: {person.age}</span>
                        <Badge className="bg-emerald-100 text-emerald-600">✅ Helped</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>📞 {person.phone}</span>
                        <span>📍 {person.city}</span>
                        <span>📅 {new Date(person.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Needs:</strong> {person.needs.join(', ')}
                      </p>
                      <p className="text-sm">{person.description}</p>
                    </div>
                    <Button 
                      onClick={() => handleRemoveFromHelped(person.id)}
                      disabled={updateStatusMutation.isPending}
                      variant="outline"
                      className="bg-emerald-100 text-emerald-600 border-emerald-300 hover:bg-emerald-200"
                      size="sm"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      {updateStatusMutation.isPending ? 'Processing...' : 'Remove from Helped'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Verified Requests ({verifiedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {verifiedRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No verified requests yet.</p>
            ) : (
              <div className="space-y-3">
                {verifiedRequests.slice(0, 5).map((person: NeedyPerson) => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-gray-500">{person.city}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                ))}
                {verifiedRequests.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{verifiedRequests.length - 5} more verified requests
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Rejected Requests ({rejectedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rejectedRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No rejected requests.</p>
            ) : (
              <div className="space-y-3">
                {rejectedRequests.slice(0, 5).map((person: NeedyPerson) => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-gray-500">{person.city}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                  </div>
                ))}
                {rejectedRequests.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
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
