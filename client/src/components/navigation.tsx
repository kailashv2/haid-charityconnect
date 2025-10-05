import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Heart, BarChart3, Users, Gift, HandHeart, Menu, X, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check admin login status
  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = localStorage.getItem("isAdminLoggedIn");
      setIsAdminLoggedIn(!!adminStatus);
    };
    
    checkAdminStatus();
    // Listen for storage changes (when admin logs in/out)
    window.addEventListener('storage', checkAdminStatus);
    
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminUsername");
    setIsAdminLoggedIn(false);
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    // Force redirect to home page
    window.location.href = "/";
  };

  const navItems = [
    { href: "/", icon: Heart, label: "Home" },
    { href: "/donate-items", icon: Gift, label: "Donate Items" },
    { href: "/donate-money", icon: HandHeart, label: "Donate Money" },
    { href: "/register-needy", icon: Users, label: "Register Needy" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/admin/login", icon: Shield, label: "Admin" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home-nav">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">HAID</span>
          </Link>

          {/* Desktop Navigation - Exact HAID Style */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Home Button */}
            <Link href="/">
              <Button 
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/") 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className="w-4 h-4" />
                Home
              </Button>
            </Link>

            {/* Donate Items */}
            <Link href="/donate-items">
              <Button 
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/donate-items") 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Gift className="w-4 h-4" />
                Donate Items
              </Button>
            </Link>

            {/* Donate Money */}
            <Link href="/donate-money">
              <Button 
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/donate-money") 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <HandHeart className="w-4 h-4" />
                Donate Money
              </Button>
            </Link>

            {/* Register Needy */}
            <Link href="/register-needy">
              <Button 
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/register-needy") 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Register Needy
              </Button>
            </Link>

            {/* Analytics */}
            <Link href="/analytics">
              <Button 
                size="sm"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive("/analytics") 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </Link>

            {/* Admin Section */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/admin/dashboard">
                  <Button 
                    size="sm"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive("/admin/dashboard") 
                        ? 'bg-green-600 text-white shadow-md' 
                        : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  size="sm"
                  onClick={handleAdminLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/admin/login">
                <Button 
                  size="sm"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive("/admin") 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t" data-testid="mobile-menu">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} data-testid={`link-mobile-${item.label.toLowerCase().replace(' ', '-')}`}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="w-full justify-start flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}