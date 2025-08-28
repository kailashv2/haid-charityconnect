import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">HAID</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Helping Aid for Indian Development - Making a difference through community support and donations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/donate-items" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-donate-items">
                Donate Items
              </Link>
              <Link href="/donate-money" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-donate-money">
                Donate Money
              </Link>
              <Link href="/register-needy" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-register-needy">
                Register Needy
              </Link>
              <Link href="/analytics" className="block text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-analytics">
                Analytics
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@haid.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Our Impact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Communities Served: 50+</div>
              <div>Active Volunteers: 200+</div>
              <div>Partner Organizations: 25+</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 HAID - Helping Aid for Indian Development. Made with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}