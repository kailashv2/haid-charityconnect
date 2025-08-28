import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, Users, DollarSign, FileText } from "lucide-react";

export default function HomePage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative py-20 text-primary-foreground"
        style={{
          background: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8)), url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Make a Difference Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            Join HAID in creating positive change. Donate items or money to help those in need across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate-items" data-testid="link-donate-items-hero">
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg font-semibold shadow-lg"
              >
                Donate Items
              </Button>
            </Link>
            <Link href="/donate-money" data-testid="link-donate-money-hero">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 text-lg font-semibold shadow-lg"
              >
                Donate Money
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-muted p-8 rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-total-donations">
                {isLoading ? "..." : (analytics as any)?.totalDonations?.toLocaleString() || "0"}
              </div>
              <div className="text-muted-foreground font-medium">Total Donations</div>
            </div>
            <div className="bg-muted p-8 rounded-xl">
              <div className="text-4xl font-bold text-secondary mb-2" data-testid="text-people-helped">
                {isLoading ? "..." : (analytics as any)?.peopleHelped?.toLocaleString() || "0"}
              </div>
              <div className="text-muted-foreground font-medium">People Helped</div>
            </div>
            <div className="bg-muted p-8 rounded-xl">
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-amount-raised">
                {isLoading ? "..." : formatCurrency((analytics as any)?.totalMonetaryAmount || 0)}
              </div>
              <div className="text-muted-foreground font-medium">Amount Raised</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="text-how-it-works-title">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Choose Your Donation</h3>
              <p className="text-muted-foreground">
                Select to donate physical items or contribute money to help those in need.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Fill Details</h3>
              <p className="text-muted-foreground">
                Provide necessary information and location for item pickup or payment processing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Make Impact</h3>
              <p className="text-muted-foreground">
                Your donation reaches those who need it most, creating positive change in their lives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
