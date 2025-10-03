import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Users, DollarSign, ArrowRight, CheckCircle, Gift, Handshake, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { data: analytics, isLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['/api/analytics'],
    refetchInterval: 5000, // More frequent updates
    refetchOnWindowFocus: true,
    staleTime: 0, // Always fetch fresh data
  });

  const { data: donationsData, refetch: refetchDonations } = useQuery({
    queryKey: ['/api/donations'],
    refetchInterval: 5000, // More frequent updates
    refetchOnWindowFocus: true,
    staleTime: 0, // Always fetch fresh data
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Combine and sort recent donations
  const itemDonations = donationsData?.itemDonations || [];
  const monetaryDonations = donationsData?.monetaryDonations || [];
  
  const allDonations = [
    ...itemDonations.map((d: any) => ({ ...d, type: 'item' })),
    ...monetaryDonations.map((d: any) => ({ ...d, type: 'monetary' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const recentDonations = allDonations.slice(0, 4);

  // Image carousel for hero section
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Modal state for impact cards
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Function to handle card clicks and refresh data
  const handleCardClick = (cardType: string) => {
    setSelectedCard(cardType);
    // Force refresh data when modal opens
    refetchAnalytics();
    refetchDonations();
  };
  
  const heroImages = [
    {
      src: "/attached_assets/generated_images/Education_support_for_children_a850d0df.png",
      title: "Educational Support",
      description: "Supporting children's education"
    },
    {
      src: "/attached_assets/generated_images/Healthcare_for_rural_communities_125ab937.png",
      title: "Healthcare Support", 
      description: "Medical aid for communities"
    },
    {
      src: "/attached_assets/generated_images/Food_distribution_to_needy_families_d3150708.png",
      title: "Food Distribution",
      description: "Feeding families in need"
    },
    {
      src: "/attached_assets/generated_images/Clothing_donation_for_elderly_e69dc418.png",
      title: "Clothing Donation",
      description: "Providing warm clothing"
    }
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Exact HAID Design */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-16 lg:py-24 overflow-hidden dark:from-blue-700 dark:via-blue-800 dark:to-green-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 z-10">
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <Heart className="w-4 h-4 mr-2" />
                Connecting need with help
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  Connecting need with help—
                  <span className="text-green-300">fast</span>,{" "}
                  <span className="text-blue-300">transparent</span>, and{" "}
                  <span className="text-yellow-300">trustworthy</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-blue-100 max-w-xl leading-relaxed">
                  HAID bridges people in need with those who want to help, ensuring every donation reaches the right hands through our transparent platform in distress.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/donate-items">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300">
                    Request Now
                  </Button>
                </Link>
                <Link href="/donate-money">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-300">
                    Contribute Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Animated Hero Image Carousel */}
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="relative h-72 lg:h-80 rounded-xl overflow-hidden">
                  {heroImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                        index === currentImageIndex 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-105'
                      }`}
                    >
                      <img 
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <div className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg inline-block">
                            <div className="font-bold text-sm">{image.title}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Carousel Indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section - Exact HAID Style */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-2"></div>
                <p className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide text-sm">
                  Real Data - Grows with Every Contribution
                </p>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See how your contributions are making a real difference in communities across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Total Donations */}
            <div className="text-center group">
              <div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() => handleCardClick('donations')}
              >
                <div className="text-6xl lg:text-7xl font-bold text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {isLoading ? "..." : allDonations.length.toLocaleString()}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Total Donations</div>
                <div className="text-gray-600 dark:text-gray-300">Items and money contributed</div>
                <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">Click for details →</div>
              </div>
            </div>

            {/* People Helped */}
            <div className="text-center group">
              <div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() => handleCardClick('people')}
              >
                <div className="text-6xl lg:text-7xl font-bold text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {isLoading ? "..." : allDonations.filter(d => d.status === 'completed').length.toLocaleString()}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">People Helped</div>
                <div className="text-gray-600 dark:text-gray-300">Lives positively impacted</div>
                <div className="mt-4 text-sm text-green-600 dark:text-green-400 font-medium">Click for details →</div>
              </div>
            </div>

            {/* Amount Raised */}
            <div className="text-center group">
              <div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
                onClick={() => handleCardClick('amount')}
              >
                <div className="text-5xl lg:text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {isLoading ? "..." : formatCurrency(monetaryDonations.reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0))}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Amount Raised</div>
                <div className="text-gray-600 dark:text-gray-300">Funds collected for causes</div>
                <div className="mt-4 text-sm text-purple-600 dark:text-purple-400 font-medium">Click for details →</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donate-items">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg">
                  Donate Items
                </Button>
              </Link>
              <Link href="/donate-money">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg">
                  Contribute Money
                </Button>
              </Link>
              <Link href="/register-needy">
                <Button variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 text-lg font-semibold rounded-xl">
                  Register Someone in Need
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section - HAID Style */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2 uppercase tracking-wide text-sm">
              * Real-time updates from our community
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See the latest donations and help being provided across our platform
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 lg:p-12 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                Recent Donations
              </h3>
              <Link href="/analytics">
                <Button variant="outline" className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 dark:text-blue-400">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {recentDonations.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No donations yet. Be the first to make a difference!</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  Join our community of helpers and start making an impact today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/donate-items">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold">
                      Donate Items
                    </Button>
                  </Link>
                  <Link href="/donate-money">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold">
                      Donate Money
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {recentDonations.map((donation: any, index: number) => {
                  const isMonetary = donation.type === 'monetary';
                  const displayName = isMonetary ? `₹${donation.amount} Donation` : `${donation.category} Donation`;
                  const description = isMonetary ? donation.purpose : donation.description;
                  const timeAgo = new Date(donation.createdAt).toLocaleDateString();
                  
                  return (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-start space-x-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          isMonetary ? 'bg-purple-100 dark:bg-purple-900' : 'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          {isMonetary ? (
                            <DollarSign className={`w-7 h-7 ${isMonetary ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`} />
                          ) : (
                            <Gift className={`w-7 h-7 ${isMonetary ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h4>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{timeAgo}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{description}</p>
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              donation.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              {donation.status === 'completed' ? '✅ Completed' : '⏳ Processing'}
                            </span>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              isMonetary ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {isMonetary ? '💰 Money' : '📦 Items'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section - HAID Style */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2 uppercase tracking-wide text-sm">
              * Making a difference is simple and transparent
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Making a difference is simple with our transparent process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:scale-105">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Donation</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Select whether you want to donate physical items like food, clothing, or books, or contribute money for specific causes.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:scale-105">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">Fill Your Details</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Provide your contact information and donation details. For items, we'll arrange pickup. For money, use our secure payment system.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:scale-105">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">Create Real Impact</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Your donation reaches verified individuals in need. Track the impact through our transparent system and see the difference you've made.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Stay Updated with Our Impact
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get regular updates on how your contributions are making a difference in communities across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Impact Details Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {selectedCard === 'donations' && (
                  <>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Total Donations Details</h3>
                  </>
                )}
                {selectedCard === 'people' && (
                  <>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">People Helped Details</h3>
                  </>
                )}
                {selectedCard === 'amount' && (
                  <>
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Amount Raised Details</h3>
                  </>
                )}
              </div>
              <button 
                onClick={() => setSelectedCard(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {selectedCard === 'donations' && (
                <div>
                  <div className="text-center mb-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Complete breakdown of all donations received</p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="text-center">
                      <h5 className="text-blue-500 font-medium mb-2 text-sm">Item Donations</h5>
                      <div className="text-5xl font-bold text-black dark:text-white mb-1">
                        {itemDonations.length}
                      </div>
                    </div>
                    <div className="text-center">
                      <h5 className="text-green-500 font-medium mb-2 text-sm">Monetary Donations</h5>
                      <div className="text-5xl font-bold text-black dark:text-white mb-1">
                        {monetaryDonations.length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
                        All Item Donations ({itemDonations.length})
                      </h4>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
                        <div className="flex items-center mb-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-medium text-black dark:text-white text-sm">Donation Impact</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <span className="text-green-600 dark:text-green-400">Items Delivered: </span>
                            <span className="font-bold text-black dark:text-white">{itemDonations.filter((d: any) => d.status === 'completed').length}</span>
                          </div>
                          <div>
                            <span className="text-blue-600 dark:text-blue-400">In Processing: </span>
                            <span className="font-bold text-black dark:text-white">{itemDonations.filter((d: any) => d.status === 'pending').length}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-purple-600 dark:text-purple-400">Success Rate: </span>
                          <span className="font-bold text-black dark:text-white">
                            {itemDonations.length > 0 ? Math.round((itemDonations.filter((d: any) => d.status === 'completed').length / itemDonations.length) * 100) : 0}%
                          </span>
                        </div>
                      </div>

                      {itemDonations.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-300 text-6xl mb-4">📦</div>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">No item donations yet. Be the first to donate items!</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h5 className="font-medium text-black dark:text-white text-sm mb-3">Recent Item Donations:</h5>
                          {itemDonations.slice(0, 5).map((donation: any, index: number) => (
                            <div key={donation.id || index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-3 border-blue-500">
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-black dark:text-white text-sm">
                                      {donation.category}
                                    </span>
                                    {donation.status && (
                                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                        donation.status === 'completed' 
                                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                          : donation.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                      }`}>
                                        {donation.status}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    {donation.description && `${donation.description} • `}
                                    {donation.quantity && `Qty: ${donation.quantity} • `}
                                    {donation.condition && donation.condition}
                                  </div>
                                  
                                  <div className="text-xs text-gray-400 dark:text-gray-500">
                                    {donation.donorName && `Donor: ${donation.donorName} • `}
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {itemDonations.length > 5 && (
                            <div className="text-center py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                📦 And {itemDonations.length - 5} more item donations in database...
                              </span>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Total: {itemDonations.length} items • Completed: {itemDonations.filter((d: any) => d.status === 'completed').length} • Pending: {itemDonations.filter((d: any) => d.status === 'pending').length}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
                        All Monetary Donations ({monetaryDonations.length})
                      </h4>
                      
                      {monetaryDonations.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-300 text-6xl mb-4">♡</div>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">No monetary donations yet. Be the first to contribute!</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {monetaryDonations.slice(0, 5).map((donation: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                              <div>
                                <div className="font-semibold text-black dark:text-white">
                                  {formatCurrency(donation.amount || 0)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {donation.purpose || 'General donation'}
                                </div>
                              </div>
                              <div className="text-sm text-gray-400 dark:text-gray-500">
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedCard === 'people' && (
                <div>
                  <div className="text-center mb-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Information about verified individuals who received assistance</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center">
                      <h5 className="text-green-600 font-medium mb-2 text-sm">Verified & Helped</h5>
                      <div className="text-4xl font-bold text-black dark:text-white">
                        {allDonations.filter(d => d.status === 'completed').length}
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl text-center">
                      <h5 className="text-yellow-600 font-medium mb-2 text-sm">Pending Verification</h5>
                      <div className="text-4xl font-bold text-black dark:text-white">
                        {allDonations.filter(d => d.status === 'pending').length}
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
                      <h5 className="text-blue-600 font-medium mb-2 text-sm">Total Registered</h5>
                      <div className="text-4xl font-bold text-black dark:text-white">
                        {allDonations.length}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Verified & Helped People</h4>
                      {allDonations.filter(d => d.status === 'completed').length === 0 ? (
                        <p className="text-gray-400 dark:text-gray-500 text-center py-4 text-sm">No verified cases yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {allDonations.filter(d => d.status === 'completed').slice(0, 3).map((donation: any, index: number) => (
                            <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                              <div className="font-medium text-black dark:text-white">
                                {donation.type === 'monetary' ? `₹${donation.amount} donation` : `${donation.category} donation`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Completed on {new Date(donation.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Pending Verification</h4>
                      {allDonations.filter(d => d.status === 'pending').length === 0 ? (
                        <p className="text-gray-400 dark:text-gray-500 text-center py-4 text-sm">No pending cases.</p>
                      ) : (
                        <div className="space-y-3">
                          {allDonations.filter(d => d.status === 'pending').slice(0, 3).map((donation: any, index: number) => (
                            <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                              <div className="font-medium text-black dark:text-white">
                                {donation.type === 'monetary' ? `₹${donation.amount} donation` : `${donation.category} donation`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Submitted on {new Date(donation.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                      <div className="flex items-center mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="font-medium text-black dark:text-white text-sm">Summary</span>
                      </div>
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                          <span className="text-blue-600 dark:text-blue-400">Total Registered: </span>
                          <span className="font-bold text-black dark:text-white">{allDonations.length}</span>
                        </div>
                        <div>
                          <span className="text-green-600 dark:text-green-400">Successfully Helped: </span>
                          <span className="font-bold text-black dark:text-white">{allDonations.filter(d => d.status === 'completed').length}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 text-sm mt-3">
                        <div>
                          <span className="text-yellow-600 dark:text-yellow-400">Awaiting Verification: </span>
                          <span className="font-bold text-black dark:text-white">{allDonations.filter(d => d.status === 'pending').length}</span>
                        </div>
                        <div>
                          <span className="text-blue-600 dark:text-blue-400">Success Rate: </span>
                          <span className="font-bold text-black dark:text-white">
                            {allDonations.length > 0 ? Math.round((allDonations.filter(d => d.status === 'completed').length / allDonations.length) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedCard === 'amount' && (
                <div>
                  <div className="text-center mb-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Breakdown of monetary contributions received</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {formatCurrency(monetaryDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0))}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Total Amount Raised</div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {monetaryDonations.filter((d: any) => d.status === 'completed').length}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">Completed Donations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-black dark:text-white mb-2">
                        {monetaryDonations.filter((d: any) => d.status === 'pending').length}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm">Pending Donations</div>
                    </div>
                  </div>

                  {monetaryDonations.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-gray-300 text-8xl mb-6">♡</div>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">No monetary donations yet. Be the first to contribute!</p>
                      <Link href="/donate-money">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium">
                          Donate Money
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Recent Monetary Donations</h4>
                        <div className="space-y-3">
                          {monetaryDonations.slice(0, 5).map((donation: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                              <div>
                                <div className="font-bold text-orange-600 dark:text-orange-400 text-lg">
                                  {formatCurrency(donation.amount || 0)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {donation.purpose || 'General donation'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-400 dark:text-gray-500">
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs mt-1 inline-block ${
                                  donation.status === 'completed' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                }`}>
                                  {donation.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                        <h5 className="font-medium text-black dark:text-white mb-3 text-sm">Summary</h5>
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <span className="text-orange-600 dark:text-orange-400">Total Raised: </span>
                            <span className="font-bold text-black dark:text-white">{formatCurrency(monetaryDonations.reduce((sum: number, d: any) => sum + (d.amount || 0), 0))}</span>
                          </div>
                          <div>
                            <span className="text-green-600 dark:text-green-400">Completed: </span>
                            <span className="font-bold text-black dark:text-white">{monetaryDonations.filter((d: any) => d.status === 'completed').length}</span>
                          </div>
                          <div>
                            <span className="text-yellow-600 dark:text-yellow-400">Pending: </span>
                            <span className="font-bold text-black dark:text-white">{monetaryDonations.filter((d: any) => d.status === 'pending').length}</span>
                          </div>
                          <div>
                            <span className="text-blue-600 dark:text-blue-400">Success Rate: </span>
                            <span className="font-bold text-black dark:text-white">
                              {monetaryDonations.length > 0 ? Math.round((monetaryDonations.filter((d: any) => d.status === 'completed').length / monetaryDonations.length) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Link href="/analytics">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  onClick={() => setSelectedCard(null)}
                >
                  View Full Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
