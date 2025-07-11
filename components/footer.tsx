'use client';

import { useState } from 'react';
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ text: 'Email is required', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: 'Subscriber'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setMessage({ 
        text: 'Success! Please check your email.', 
        type: 'success' 
      });
      setEmail('');
    } catch (error: any) {
      setMessage({ 
        text: error.message || 'Failed to subscribe. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-light tracking-wider">ÉDEN</h3>
            <p className="text-gray-400 leading-relaxed font-light">
              Where luxury meets essence. Discover our exclusive collection of premium fragrances crafted for the discerning.
            </p>
            <div className="flex space-x-5">
              <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Collections Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium tracking-wider uppercase">Collections</h4>
            <div className="space-y-3">
              <Link href="/products" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                Signature Scents
              </Link>
              <Link href="/products?category=women" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                For Her
              </Link>
              <Link href="/products?category=men" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                For Him
              </Link>
              <Link href="/products?category=unisex" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                Unisex
              </Link>
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium tracking-wider uppercase">Assistance</h4>
            <div className="space-y-3">
              <Link href="/contact" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                Contact Us
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                Shipping & Delivery
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                Returns & Exchanges
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-amber-400 transition-colors duration-300 font-light">
                Fragrance Consultation
              </Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium tracking-wider uppercase">Stay Connected</h4>
            <p className="text-gray-400 text-sm font-light">
              Subscribe for exclusive access to limited editions, private events, and special offers.
            </p>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-600 border border-gray-700 font-light"
                  required
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  className="px-4 py-3 bg-amber-700 hover:bg-amber-800 transition-colors duration-300 flex items-center justify-center whitespace-nowrap min-w-[50px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
              {message.text && (
                <p className={`mt-2 text-sm ${
                  message.type === 'error' ? 'text-red-400' : 'text-amber-400'
                }`}>
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm font-light">© {new Date().getFullYear()} ÉDEN Parfums. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <Link href="#" className="text-gray-500 hover:text-amber-400 text-sm transition-colors duration-300 font-light">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-amber-400 text-sm transition-colors duration-300 font-light">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-500 hover:text-amber-400 text-sm transition-colors duration-300 font-light">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}