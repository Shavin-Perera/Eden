# ÉDEN Perfume Website

A luxury perfume e-commerce website built with Next.js, TypeScript, and Tailwind CSS.

## 🚨 Security Notice

This application has been audited and secured with the following measures:

### ✅ Security Features Implemented

- **Input Validation & Sanitization**: All user inputs are validated using Zod schemas and sanitized to prevent XSS attacks
- **Rate Limiting**: API endpoints are protected with rate limiting to prevent abuse
- **Secure Headers**: Comprehensive security headers including CSP, HSTS, and XSS protection
- **Environment Variables**: Sensitive configuration is properly managed through environment variables
- **No Sensitive Data Storage**: Credit card information is not collected or stored on the server
- **API Security**: All API endpoints validate and sanitize input data
- **Error Handling**: Secure error handling that doesn't expose sensitive information

### ⚠️ Security Considerations

- **Authentication**: Currently uses mock authentication for demonstration. Replace with real authentication (NextAuth.js, Auth0, etc.) for production
- **Payment Processing**: Integrate with secure payment processors (Stripe, PayPal) for production
- **Database**: Use production-ready database with proper security configurations
- **Rate Limiting**: Replace in-memory rate limiting with Redis for production

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- MongoDB (for newsletter functionality)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eden-perfume-website
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/eden_newsletter

# Email Service (Resend)
RESEND_API=your_resend_api_key_here

# Application Configuration
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `RESEND_API` | Resend API key for email service | Yes | - |
| `NODE_ENV` | Application environment | No | development |

### Security Headers

The application includes comprehensive security headers:

- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME type sniffing)
- **X-XSS-Protection**: 1; mode=block (XSS protection)
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains (HSTS)
- **Content-Security-Policy**: Restricts resource loading
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts browser features

## 📁 Project Structure

```
eden-perfume-website/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form API
│   │   ├── checkout/      # Checkout API
│   │   └── newsletter/    # Newsletter subscription API
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── contact/           # Contact page
│   ├── products/          # Products listing
│   └── product/           # Individual product pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth-dialog.tsx   # Authentication dialog
│   ├── auth-provider.tsx # Authentication context
│   ├── cart-provider.tsx # Shopping cart context
│   └── ...
├── lib/                  # Utility functions
└── public/              # Static assets
```

## 🔒 API Endpoints

### POST /api/newsletter
Newsletter subscription endpoint with rate limiting and validation.

**Rate Limit**: 3 requests per minute per IP

### POST /api/contact
Contact form submission endpoint with rate limiting and validation.

**Rate Limit**: 2 requests per hour per IP

### POST /api/checkout
Checkout processing endpoint (simulated payment processing).

**Rate Limit**: 5 requests per hour per IP

## 🚀 Production Deployment

### Security Checklist

Before deploying to production:

- [ ] Replace mock authentication with real authentication
- [ ] Integrate with secure payment processor
- [ ] Set up production database with proper security
- [ ] Configure Redis for rate limiting
- [ ] Set up SSL/TLS certificates
- [ ] Configure proper environment variables
- [ ] Set up monitoring and logging
- [ ] Implement proper session management
- [ ] Set up backup and recovery procedures

### Recommended Services

- **Authentication**: NextAuth.js, Auth0, or Clerk
- **Payment Processing**: Stripe, PayPal, or Square
- **Database**: MongoDB Atlas, PostgreSQL with Supabase
- **Rate Limiting**: Redis with Upstash or Redis Cloud
- **Email**: Resend, SendGrid, or AWS SES
- **Hosting**: Vercel, Netlify, or AWS

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run linting:
```bash
npm run lint
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please contact:
- Email: support@eden-parfums.com
- Phone: +1 (555) 123-4567

---

**Note**: This is a demonstration application. For production use, ensure all security measures are properly implemented and tested. 