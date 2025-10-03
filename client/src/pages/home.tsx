import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { TrendingUp, Users, DollarSign, FileText, Heart, ArrowRight, Sparkles, X, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { RecentDonations } from "@/components/recent-donations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import the generated images
import foodDistributionImage from "@assets/generated_images/Food_distribution_to_needy_families_d3150708.png";
import educationSupportImage from "@assets/generated_images/Education_support_for_children_a850d0df.png";
import clothingDonationImage from "@assets/generated_images/Clothing_donation_for_elderly_e69dc418.png";
import healthcareImage from "@assets/generated_images/Healthcare_for_rural_communities_125ab937.png";

export default function HomePage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
  });

  // Fetch donations data for details
  const { data: donationsData } = useQuery({
    queryKey: ['/api/donations'],
  });

  // Fetch needy persons data for details
  const { data: needyData } = useQuery({
    queryKey: ['/api/needy'],
  });

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Dialog states
  const [showDonationsDialog, setShowDonationsDialog] = useState(false);
  const [showPeopleDialog, setShowPeopleDialog] = useState(false);
  const [showAmountDialog, setShowAmountDialog] = useState(false);
  
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
          <div className="animate-in fade-in duration-1000">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in slide-in-from-bottom-4 duration-1000" data-testid="text-hero-title">
              Make a Difference Today
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-in slide-in-from-bottom-6 duration-1000 delay-200" data-testid="text-hero-subtitle">
              Join HAID in creating positive change. Donate items or money to help those in need across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-500">
              <Link href="/donate-items" data-testid="link-donate-items-hero">
                <Button 
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-300 group"
                >
                  Donate Items
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/donate-money" data-testid="link-donate-money-hero">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-300 group"
                >
                  Donate Money
                  <Heart className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Impact by Numbers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Together we're making a real difference in communities across India
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div 
              className="bg-muted p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group relative"
              onClick={() => setShowDonationsDialog(true)}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="text-total-donations">
                {isLoading ? "..." : (analytics as any)?.totalDonations?.toLocaleString() || "0"}
              </div>
              <div className="text-muted-foreground font-medium">Total Donations</div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div 
              className="bg-muted p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group relative"
              onClick={() => setShowPeopleDialog(true)}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-4xl font-bold text-secondary mb-2" data-testid="text-people-helped">
                {isLoading ? "..." : (analytics as any)?.peopleHelped?.toLocaleString() || "0"}
              </div>
              <div className="text-muted-foreground font-medium">People Helped</div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <div 
              className="bg-muted p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group relative"
              onClick={() => setShowAmountDialog(true)}
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-accent" />
              </div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-amount-raised">
                {isLoading ? "..." : formatCurrency((analytics as any)?.totalMonetaryAmount || 0)}
              </div>
              <div className="text-muted-foreground font-medium">Amount Raised</div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 text-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <RecentDonations />
            </div>
            <div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl h-full flex flex-col justify-center">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-primary mb-4">Join Our Community</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Every contribution matters. Whether it's donating items, money, or helping someone in need get registered, you're part of something bigger.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register-needy" data-testid="link-register-needy-cta">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Register Someone in Need
                      </Button>
                    </Link>
                    <Link href="/analytics" data-testid="link-analytics-cta">
                      <Button variant="outline" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        View Impact Analytics
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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

      {/* Donations Details Dialog */}
      <Dialog open={showDonationsDialog} onOpenChange={setShowDonationsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Total Donations Details
            </DialogTitle>
            <DialogDescription>
              Complete breakdown of all donations received
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Item Donations</h4>
                <p className="text-2xl font-bold">{(donationsData as any)?.itemDonations?.length || 0}</p>
              </div>
              <div className="bg-secondary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-secondary mb-2">Monetary Donations</h4>
                <p className="text-2xl font-bold">{(donationsData as any)?.monetaryDonations?.length || 0}</p>
              </div>
            </div>
            
            {/* All Item Donations */}
            <div>
              <h4 className="font-semibold mb-3">All Item Donations ({(donationsData as any)?.itemDonations?.length || 0})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(donationsData as any)?.itemDonations?.map((donation: any, index: number) => {
                  // Determine if donation has helped someone based on status and age
                  const isDelivered = donation.status === 'completed' || donation.status === 'delivered';
                  const isOld = new Date().getTime() - new Date(donation.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000; // 7 days old
                  const hasHelped = isDelivered || (isOld && donation.status !== 'cancelled');
                  
                  return (
                    <div key={index} className="bg-muted p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{donation.category}</p>
                            {hasHelped ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                ✅ Helped
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                📦 Processing
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{donation.description}</p>
                          {donation.quantity && (
                            <p className="text-xs text-muted-foreground">
                              Quantity: {donation.quantity}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Donated: {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                          {hasHelped && (
                            <p className="text-xs text-green-600 font-medium">
                              🎯 Impact: Reached people in need
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs text-center">
                            {donation.condition}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs text-center ${
                            donation.status === 'completed' || donation.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : donation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {donation.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }) || <p className="text-muted-foreground">No item donations yet</p>}
              </div>
              
              {/* Donation Impact Summary */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <h5 className="font-semibold text-sm mb-2">📊 Donation Impact</h5>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-green-600">Items Delivered:</span>
                    <span className="font-bold ml-1">
                      {(donationsData as any)?.itemDonations?.filter((d: any) => {
                        const isDelivered = d.status === 'completed' || d.status === 'delivered';
                        const isOld = new Date().getTime() - new Date(d.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000;
                        return isDelivered || (isOld && d.status !== 'cancelled');
                      }).length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600">In Processing:</span>
                    <span className="font-bold ml-1">
                      {(donationsData as any)?.itemDonations?.filter((d: any) => {
                        const isDelivered = d.status === 'completed' || d.status === 'delivered';
                        const isOld = new Date().getTime() - new Date(d.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000;
                        return !(isDelivered || (isOld && d.status !== 'cancelled'));
                      }).length || 0}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-purple-600">Success Rate:</span>
                    <span className="font-bold ml-1">
                      {(donationsData as any)?.itemDonations?.length > 0 
                        ? Math.round(((donationsData as any)?.itemDonations?.filter((d: any) => {
                            const isDelivered = d.status === 'completed' || d.status === 'delivered';
                            const isOld = new Date().getTime() - new Date(d.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000;
                            return isDelivered || (isOld && d.status !== 'cancelled');
                          }).length / (donationsData as any)?.itemDonations?.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* All Monetary Donations */}
            <div>
              <h4 className="font-semibold mb-3">All Monetary Donations ({(donationsData as any)?.monetaryDonations?.length || 0})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(donationsData as any)?.monetaryDonations?.map((donation: any, index: number) => (
                  <div key={index} className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">₹{parseFloat(donation.amount).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{donation.purpose}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        donation.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No monetary donations yet</p>}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* People Helped Details Dialog */}
      <Dialog open={showPeopleDialog} onOpenChange={setShowPeopleDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-secondary" />
              People Helped Details
            </DialogTitle>
            <DialogDescription>
              Information about verified individuals who received assistance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Verified & Helped</h4>
                <p className="text-2xl font-bold text-green-800">
                  {(needyData as any)?.filter((person: any) => person.verified)?.length || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Pending Verification</h4>
                <p className="text-2xl font-bold text-yellow-800">
                  {(needyData as any)?.filter((person: any) => !person.verified && person.status === 'pending')?.length || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Total Registered</h4>
                <p className="text-2xl font-bold text-blue-800">
                  {(needyData as any)?.length || 0}
                </p>
              </div>
            </div>
            
            {/* Verified People */}
            <div>
              <h4 className="font-semibold mb-3">Verified & Helped People</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(needyData as any)?.filter((person: any) => person.verified)?.map((person: any, index: number) => (
                  <div key={index} className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {person.age} years old, {person.city}, {person.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Needs: {person.needs?.join(', ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Registered: {new Date(person.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        ✅ Verified
                      </span>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No verified people yet</p>}
              </div>
            </div>

            {/* Pending Verification */}
            <div>
              <h4 className="font-semibold mb-3">Pending Verification</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(needyData as any)?.filter((person: any) => !person.verified && person.status === 'pending')?.map((person: any, index: number) => (
                  <div key={index} className="bg-muted p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {person.age} years old, {person.city}, {person.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Needs: {person.needs?.join(', ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Situation: {person.situation?.substring(0, 80)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Registered: {new Date(person.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-blue-600">
                          Reporter: {person.reporterName} ({person.reporterRelationship})
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        ⏳ Pending
                      </span>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No pending verifications</p>}
              </div>
            </div>

            {/* All Registered People Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Total Registered:</span>
                  <span className="font-bold ml-2">{(needyData as any)?.length || 0}</span>
                </div>
                <div>
                  <span className="text-green-600">Successfully Helped:</span>
                  <span className="font-bold ml-2">{(needyData as any)?.filter((p: any) => p.verified)?.length || 0}</span>
                </div>
                <div>
                  <span className="text-yellow-600">Awaiting Verification:</span>
                  <span className="font-bold ml-2">{(needyData as any)?.filter((p: any) => !p.verified && p.status === 'pending')?.length || 0}</span>
                </div>
                <div>
                  <span className="text-blue-600">Success Rate:</span>
                  <span className="font-bold ml-2">
                    {(needyData as any)?.length > 0 
                      ? Math.round(((needyData as any)?.filter((p: any) => p.verified)?.length / (needyData as any)?.length) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Amount Raised Details Dialog */}
      <Dialog open={showAmountDialog} onOpenChange={setShowAmountDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-accent" />
              Amount Raised Details
            </DialogTitle>
            <DialogDescription>
              Breakdown of monetary contributions received
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                {formatCurrency((analytics as any)?.totalMonetaryAmount || 0)}
              </div>
              <p className="text-muted-foreground">Total Amount Raised</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-accent/10 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-accent">
                  {(donationsData as any)?.monetaryDonations?.filter((d: any) => d.status === 'completed')?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Completed Donations</p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">
                  {(donationsData as any)?.monetaryDonations?.filter((d: any) => d.status === 'pending')?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Pending Donations</p>
              </div>
            </div>

            {(analytics as any)?.totalMonetaryAmount === 0 && (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No monetary donations yet. Be the first to contribute!
                </p>
                <Link href="/donate-money">
                  <Button className="mt-4">
                    Donate Money
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
