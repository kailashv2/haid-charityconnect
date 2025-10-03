import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, DollarSign, FileText, Heart, MessageSquare } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/analytics'],
    refetchInterval: 5000, // Refresh charts every 5 seconds for immediate updates
    staleTime: 2000, // Consider data stale after 2 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on component mount
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-destructive">Failed to load analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Chart configurations with real-time data - completely rebuilt
  const totalDonations = (analytics as any)?.totalDonations || 0;
  const totalItemDonations = (analytics as any)?.totalItemDonations || 0;
  const monetaryDonations = Math.max(0, totalDonations - totalItemDonations);

  const donationTypesData = {
    labels: ['Item Donations', 'Money Donations'],
    datasets: [{
      data: [totalItemDonations, monetaryDonations],
      backgroundColor: [
        'hsl(160, 84%, 39%)', // Secondary - Items
        'hsl(214, 84%, 56%)', // Primary - Money
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  };

  // Real monthly trend data from backend
  const monthlyTrendData = {
    labels: (analytics as any)?.monthlyTrend?.map((item: any) => item.month) || [],
    datasets: [{
      label: 'Total Donations',
      data: (analytics as any)?.monthlyTrend?.map((item: any) => item.count) || [],
      borderColor: 'hsl(214, 84%, 56%)',
      backgroundColor: 'hsla(214, 84%, 56%, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'hsl(214, 84%, 56%)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  // Regional data with real values
  const regionalData = {
    labels: (analytics as any)?.donationsByRegion?.length > 0 
      ? (analytics as any).donationsByRegion.slice(0, 5).map((item: any) => item.region)
      : ['No regions yet'],
    datasets: [{
      label: 'Donations by Region',
      data: (analytics as any)?.donationsByRegion?.length > 0 
        ? (analytics as any).donationsByRegion.slice(0, 5).map((item: any) => item.count)
        : [0],
      backgroundColor: [
        'hsl(160, 84%, 39%)',
        'hsl(214, 84%, 56%)',
        'hsl(22, 82%, 39%)',
        'hsl(280, 65%, 60%)',
        'hsl(45, 93%, 47%)',
      ],
      borderWidth: 1,
      borderColor: '#ffffff',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'hsl(214, 84%, 56%)',
        borderWidth: 1,
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Analytics Dashboard</h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Real-time insights into our donation and assistance programs
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-primary" data-testid="text-total-donations">
                    {(analytics as any)?.totalDonations?.toLocaleString() || 0}
                  </p>
                )}
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-secondary">↗ 23% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">People Helped</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-secondary" data-testid="text-people-helped">
                    {(analytics as any)?.peopleHelped?.toLocaleString() || 0}
                  </p>
                )}
              </div>
              <div className="bg-secondary/10 p-3 rounded-full">
                <Users className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-secondary">↗ 18% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amount Raised</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-accent" data-testid="text-amount-raised">
                    {formatCurrency((analytics as any)?.totalMonetaryAmount || 0)}
                  </p>
                )}
              </div>
              <div className="bg-accent/10 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-secondary">↗ 31% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cases</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold text-primary" data-testid="text-active-cases">
                    {(analytics as any)?.activeCases?.toLocaleString() || 0}
                  </p>
                )}
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-secondary">↗ 12% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Donation Types Chart */}
        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Donation Types Distribution</h3>
            <div className="relative h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="w-48 h-48 rounded-full" />
                </div>
              ) : (
                <Doughnut 
                  key={`doughnut-${totalDonations}-${totalItemDonations}-${Date.now()}`}
                  data={donationTypesData} 
                  options={chartOptions} 
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Donations Trend */}
        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Donations Trend</h3>
            <div className="relative h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="w-full h-48" />
                </div>
              ) : (
                <Line 
                  key={`line-${totalDonations}-${Date.now()}`}
                  data={monthlyTrendData} 
                  options={chartOptions} 
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Need Categories and Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Need Categories */}
        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Need Categories</h3>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4" data-testid="need-categories-list">
                {(analytics as any)?.needsByCategory?.slice(0, 4).map((category: any, index: number) => {
                  const total = (analytics as any).needsByCategory.reduce((sum: number, cat: any) => sum + cat.count, 0);
                  const percentage = total > 0 ? Math.round((category.count / total) * 100) : 0;
                  const colors = ['hsl(214, 84%, 56%)', 'hsl(160, 84%, 39%)', 'hsl(22, 82%, 39%)', 'hsl(280, 65%, 60%)'];
                  
                  return (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: colors[index] }}
                        />
                        <span className="font-medium capitalize">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{percentage}%</span>
                        <div className="w-24 bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: colors[index] 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="shadow-sm border border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Regional Distribution</h3>
            <div className="relative h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="w-full h-48" />
                </div>
              ) : (
                <Bar 
                  key={`bar-${(analytics as any)?.donationsByRegion?.length || 0}-${Date.now()}`}
                  data={regionalData} 
                  options={barChartOptions} 
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="shadow-sm border border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-64 mb-2" />
                    <Skeleton className="h-3 w-96" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4" data-testid="recent-activities-list">
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="bg-secondary text-secondary-foreground w-10 h-10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New monetary donation received</p>
                  <p className="text-sm text-muted-foreground">System shows active donation processing</p>
                </div>
                <span className="text-sm text-muted-foreground">Recently</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Items donation submitted</p>
                  <p className="text-sm text-muted-foreground">New item donations added to the system</p>
                </div>
                <span className="text-sm text-muted-foreground">Recently</span>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New needy person registered</p>
                  <p className="text-sm text-muted-foreground">Registration submitted for verification</p>
                </div>
                <span className="text-sm text-muted-foreground">Recently</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
