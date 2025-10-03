import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">HAID</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting those who need help with those who want to help. 
              Making charity transparent, fast, and trustworthy for everyone across India.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Our Services</h3>
            <div className="space-y-3">
              <Link href="/donate-items">
                <span className="text-gray-300 hover:text-white cursor-pointer transition-colors block text-sm">
                  Donate Items
                </span>
              </Link>
              <Link href="/donate-money">
                <span className="text-gray-300 hover:text-white cursor-pointer transition-colors block text-sm">
                  Monetary Donations
                </span>
              </Link>
              <Link href="/register-needy">
                <span className="text-gray-300 hover:text-white cursor-pointer transition-colors block text-sm">
                  Register Someone in Need
                </span>
              </Link>
              <Link href="/analytics">
                <span className="text-gray-300 hover:text-white cursor-pointer transition-colors block text-sm">
                  Impact Analytics
                </span>
              </Link>
            </div>
          </div>
          
          {/* Company Info */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Connect With Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">contact@haid.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get updates on our impact and new ways to help communities.
            </p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 HAID (Helping All In Distress). All rights reserved.
            </p>
            <div className="flex space-x-6">
              <span className="text-gray-400 hover:text-white cursor-pointer text-sm transition-colors">Privacy Policy</span>
              <span className="text-gray-400 hover:text-white cursor-pointer text-sm transition-colors">Terms of Service</span>
              <span className="text-gray-400 hover:text-white cursor-pointer text-sm transition-colors">Contact Us</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}