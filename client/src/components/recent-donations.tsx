import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Gift, Heart, MapPin } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RecentDonations() {
  const { data: donationsData, isLoading } = useQuery({
    queryKey: ['/api/donations'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Recent Donations
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  // Combine item and monetary donations and sort by date
  const itemDonations = donationsData?.itemDonations || [];
  const monetaryDonations = donationsData?.monetaryDonations || [];
  
  const allDonations = [
    ...itemDonations.map((d: any) => ({ ...d, type: 'item' })),
    ...monetaryDonations.map((d: any) => ({ ...d, type: 'monetary' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const recentDonations = allDonations.slice(0, 5);

  return (
    <Card data-testid="recent-donations">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Recent Donations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentDonations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No donations yet. Be the first to make a difference!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentDonations.map((donation: any, index: number) => {
              const isMonetary = donation.type === 'monetary';
              const displayName = isMonetary ? `₹${donation.amount} Donation` : `${donation.category} Donation`;
              const description = isMonetary ? donation.purpose : donation.description;
              const timeAgo = new Date(donation.createdAt).toLocaleDateString();
              
              return (
                <div 
                  key={donation.id || index} 
                  className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  data-testid={`recent-donation-${index}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isMonetary ? 'bg-accent' : 'bg-secondary'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {displayName}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {isMonetary ? 'Money' : donation.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        <span>{timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {donation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}