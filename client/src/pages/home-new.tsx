import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Users, DollarSign, ArrowRight, CheckCircle, Gift, Handshake, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/analytics'],
    refetchInterval: 30000,
  });

  const { data: donationsData } = useQuery({
    queryKey: ['/api/donations'],
    refetchInterval: 30000,
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
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-3 text-base hover:shadow-lg transition-all duration-300">
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
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2 uppercase tracking-wide text-sm">
              * Real data. Real impact. Real transparency.
            </p>
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="text-6xl lg:text-7xl font-bold text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {isLoading ? "..." : (analytics as any)?.totalDonations?.toLocaleString() || "0"}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Total Donations</div>
                <div className="text-gray-600 dark:text-gray-300">Items and money contributed</div>
              </div>
            </div>

            {/* People Helped */}
            <div className="text-center group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="text-6xl lg:text-7xl font-bold text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {isLoading ? "..." : (analytics as any)?.peopleHelped?.toLocaleString() || "0"}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">People Helped</div>
                <div className="text-gray-600 dark:text-gray-300">Lives positively impacted</div>
              </div>
            </div>

            {/* Amount Raised */}
            <div className="text-center group">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="text-5xl lg:text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {isLoading ? "..." : formatCurrency((analytics as any)?.totalMonetaryAmount || 0)}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">Amount Raised</div>
                <div className="text-gray-600 dark:text-gray-300">Funds collected for causes</div>
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

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/donate-items">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Gift className="w-6 h-6 mr-3" />
                  Donate Items
                </Button>
              </Link>
              <Link href="/donate-money">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Heart className="w-6 h-6 mr-3" />
                  Contribute Money
                </Button>
              </Link>
              <Link href="/register-needy">
                <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Users className="w-6 h-6 mr-3" />
                  Register Someone in Need
                </Button>
              </Link>
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
    </div>
  );
}
