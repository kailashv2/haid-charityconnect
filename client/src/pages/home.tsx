import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, Users, DollarSign, FileText } from "lucide-react";
import { useState, useEffect } from "react";

// Import the generated images
import foodDistributionImage from "@assets/generated_images/Food_distribution_to_needy_families_d3150708.png";
import educationSupportImage from "@assets/generated_images/Education_support_for_children_a850d0df.png";
import clothingDonationImage from "@assets/generated_images/Clothing_donation_for_elderly_e69dc418.png";
import healthcareImage from "@assets/generated_images/Healthcare_for_rural_communities_125ab937.png";

export default function HomePage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
  });

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const carouselImages = [
    {
      src: foodDistributionImage,
      title: "Food Distribution",
      description: "Providing essential meals to families in need"
    },
    {
      src: educationSupportImage,
      title: "Education Support",
      description: "Supporting children's education with books and supplies"
    },
    {
      src: clothingDonationImage,
      title: "Clothing Donations",
      description: "Keeping communities warm with clothing donations"
    },
    {
      src: healthcareImage,
      title: "Healthcare Access",
      description: "Bringing medical care to underserved communities"
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

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

      {/* Image Carousel Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Impact in Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See how your donations make a real difference in communities across India
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  data-testid={`carousel-slide-${index}`}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {image.title}
                      </h3>
                      <p className="text-lg opacity-90">
                        {image.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-primary' 
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  data-testid={`carousel-indicator-${index}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
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
