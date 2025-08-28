import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Heart, BarChart3, Users, Gift, HandHeart, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Heart, label: "Home" },
    { href: "/donate-items", icon: Gift, label: "Donate Items" },
    { href: "/donate-money", icon: HandHeart, label: "Donate Money" },
    { href: "/register-needy", icon: Users, label: "Register Needy" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home-nav">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">HAID</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}-nav`}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
            <ThemeToggle />
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