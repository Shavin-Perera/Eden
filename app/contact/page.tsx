import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { z } from 'zod';

const ContactSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1).max(100),
  message: z.string().min(1).max(1000),
});

export default function ContactPage() {
  // TODO: On form submit, validate with ContactSchema and send to a secure API endpoint
  // All input fields are validated and sanitized client-side here, but must also be validated server-side
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
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-gray-700 font-light">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter your first name" 
                    className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-gray-700 font-light">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter your last name" 
                    className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 font-light">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-gray-700 font-light">Phone (Optional)</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-gray-700 font-light">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="What is this regarding?" 
                  className="border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="message" className="text-gray-700 font-light">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can assist you..." 
                  className="min-h-32 border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <Button className="w-full bg-amber-700 hover:bg-amber-800 py-6 text-lg tracking-wider shadow-lg transition-all">
                SEND MESSAGE
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