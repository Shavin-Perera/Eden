"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { z } from 'zod';

const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters"),
  message: z.string().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      // Validate form data
      const validatedData = ContactSchema.parse(formData);
      
      // Submit to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSubmitStatus("success");
      setSubmitMessage("Thank you! Your message has been sent successfully.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        setSubmitStatus("error");
        setSubmitMessage(error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-amber-50 py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wider mb-4">Contact ÉDEN</h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light">
            Our fragrance experts are delighted to assist you with any inquiries
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-serif font-light tracking-wide mb-8">Personal Consultation</h2>
            
            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}
            
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{submitMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-gray-700 font-light">First Name *</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name" 
                    className={`border-gray-300 focus:ring-amber-500 focus:border-amber-500 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-gray-700 font-light">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name" 
                    className={`border-gray-300 focus:ring-amber-500 focus:border-amber-500 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 font-light">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email" 
                  className={`border-gray-300 focus:ring-amber-500 focus:border-amber-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-gray-700 font-light">Phone (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number" 
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-gray-700 font-light">Subject *</Label>
                <Input 
                  id="subject" 
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="What is this regarding?" 
                  className={`border-gray-300 focus:ring-amber-500 focus:border-amber-500 ${errors.subject ? 'border-red-500' : ''}`}
                />
                {errors.subject && (
                  <p className="text-red-600 text-sm">{errors.subject}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="message" className="text-gray-700 font-light">Message *</Label>
                <Textarea 
                  id="message" 
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us how we can assist you..." 
                  className={`min-h-32 border-gray-300 focus:ring-amber-500 focus:border-amber-500 ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm">{errors.message}</p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-amber-700 hover:bg-amber-800 py-6 text-lg tracking-wider shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-serif font-light tracking-wide mb-8">Connect With Us</h2>
              <p className="text-gray-600 leading-relaxed mb-8 font-light">
                Whether you seek guidance in selecting your signature scent or require assistance, 
                our dedicated team awaits your correspondence.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="bg-amber-50 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-4 text-lg">Discover Our Collection</h3>
                      <Link href="/products">
                        <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 tracking-wider">
                          SHOP PERFUMES
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="bg-amber-50 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-lg">Concierge Service</h3>
                      <p className="text-gray-600 font-light">
                        +1 (555) 123-4567<br />
                        Available Mon-Fri: 9AM-6PM EST
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    <div className="bg-amber-50 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-lg">Electronic Correspondence</h3>
                      <p className="text-gray-600 font-light">
                        concierge@eden-parfums.com<br />
                        support@eden-parfums.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif font-light tracking-wide mb-4">Frequently Asked Questions</h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-xl font-medium mb-3 font-serif">How long do your perfumes last?</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Our exclusive fragrances are crafted with the finest ingredients, offering 8-12 hours of longevity. 
                The exceptional concentration ensures your signature scent lingers throughout the day.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3 font-serif">What is your return policy?</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                All sales are final. Due to the nature of our products, we cannot accept returns or exchanges once an order has been placed.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3 font-serif">Do you ship internationally?</h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Currently serving North America, we're expanding our global presence. 
                For international inquiries, please contact our concierge for tailored shipping solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}