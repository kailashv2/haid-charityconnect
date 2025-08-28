import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, DollarSign, Gift } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function QuickStats() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const stats = [
    {
      icon: Gift,
      label: "Total Donations",
      value: (analytics as any)?.totalDonations?.toLocaleString() || "0",
      color: "text-primary"
    },
    {
      icon: Users,
      label: "People Helped",
      value: (analytics as any)?.peopleHelped?.toLocaleString() || "0",
      color: "text-secondary"
    },
    {
      icon: DollarSign,
      label: "Amount Raised",
      value: formatCurrency((analytics as any)?.totalMonetaryAmount || 0),
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      label: "Active Cases",
      value: (analytics as any)?.activeCases?.toLocaleString() || "0",
      color: "text-primary"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="quick-stats">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-card p-4 rounded-lg border text-center hover:shadow-md transition-shadow"
          data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
        >
          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
          <p className="text-2xl font-bold mb-1">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}