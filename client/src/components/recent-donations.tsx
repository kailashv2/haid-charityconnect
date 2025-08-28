import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Gift, Heart, MapPin } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function RecentDonations() {
  const { data: donations, isLoading } = useQuery({
    queryKey: ['/api/donations/items'],
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

  const recentDonations = Array.isArray(donations) ? donations.slice(0, 5) : [];

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
            {recentDonations.map((donation: any, index: number) => (
              <div 
                key={donation.id || index} 
                className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                data-testid={`recent-donation-${index}`}
              >
                <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {donation.donorName}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {donation.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {donation.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{donation.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      <span>Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}