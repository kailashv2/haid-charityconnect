# HAID - Helping Aid for Indian Development

## Overview

HAID is a comprehensive donation management platform that facilitates both item and monetary donations for helping needy individuals across India. The application connects donors with those in need through a streamlined web interface that handles donation collection, payment processing, beneficiary registration, and analytics reporting. Built as a full-stack web application, it features real-time donation tracking, secure payment integration via Stripe, SMS notifications through Twilio, and comprehensive analytics dashboards.

The application is fully functional with:
- **Item Donation System**: Complete form with category selection, condition tracking, pickup coordination, and location services
- **Monetary Donation System**: Stripe-powered payment processing with secure card payments (configurable - works without API keys)
- **Needy Person Registration**: Comprehensive registration system with needs assessment and reporter verification
- **Analytics Dashboard**: Real-time metrics, charts, and reporting on donations and impact
- **SMS Notifications**: Automated thank-you messages via Twilio integration (optional)
- **Responsive Design**: Mobile-friendly interface with modern UI components

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using **React with TypeScript** and follows a modern component-based architecture:

- **UI Framework**: Utilizes shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Build System**: Vite for fast development and optimized production builds

The frontend follows a page-based routing structure with dedicated pages for donation forms, analytics, and beneficiary registration. Components are organized using atomic design principles with reusable UI components in the `/components/ui` directory.

### Backend Architecture
The server-side uses **Node.js with Express** in a RESTful API architecture:

- **Runtime**: Node.js with TypeScript for type safety
- **Framework**: Express.js for HTTP server and middleware handling
- **API Design**: RESTful endpoints with consistent JSON responses
- **Error Handling**: Centralized error handling middleware
- **Request Processing**: JSON body parsing and URL encoding support
- **Development**: Hot reloading with custom Vite integration

The backend implements a service layer pattern with separate modules for routing, storage abstraction, and external service integrations.

### Data Storage
**PostgreSQL** database with **Drizzle ORM** for type-safe database interactions:

- **Database**: PostgreSQL hosted on Neon for scalability and reliability
- **ORM**: Drizzle for schema definition and query building
- **Migrations**: Drizzle Kit for database schema migrations
- **Connection**: Neon serverless driver for optimal connection pooling

The database schema includes tables for donors, item donations, monetary donations, needy persons, and SMS logs with proper foreign key relationships and data validation.

### Payment Processing
**Stripe** integration for secure monetary donations:

- **Payment Intent API**: Server-side payment intent creation for secure transactions
- **React Stripe.js**: Client-side payment form handling with Payment Elements
- **Webhook Support**: Stripe webhook handling for payment status updates
- **Security**: PCI-compliant payment processing with tokenization

### Notification System
**Twilio** SMS integration for donor and beneficiary communication:

- **SMS Delivery**: Automated thank you messages and status updates
- **Logging**: Comprehensive SMS delivery tracking and status monitoring
- **Fallback**: Graceful degradation when SMS service is unavailable

### Analytics and Reporting
**Chart.js** powered analytics dashboard:

- **Real-time Metrics**: Total donations, amounts, beneficiaries helped
- **Trend Analysis**: Monthly donation trends and category breakdowns
- **Visual Charts**: Line charts, bar charts, and doughnut charts for data visualization
- **Performance Tracking**: Donation success rates and distribution analytics

### Development and Deployment
**Modern development workflow** with production-ready deployment:

- **Package Management**: npm with lockfile for dependency consistency
- **TypeScript**: Strict type checking across frontend and backend
- **Build Process**: Separate client and server build pipelines
- **Environment Configuration**: Environment-based configuration for different deployment stages
- **Asset Handling**: Optimized asset bundling and serving

## External Dependencies

### Core Technologies
- **Neon Database**: PostgreSQL hosting with serverless architecture
- **Stripe**: Payment processing and financial transaction management
- **Twilio**: SMS messaging and communication services

### UI and Component Libraries
- **Radix UI**: Headless UI primitives for accessibility and customization
- **shadcn/ui**: Pre-built component library with Tailwind CSS integration
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and development server
- **Drizzle Kit**: Database migration and schema management
- **TanStack Query**: Server state management and data fetching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

### Supporting Libraries
- **Chart.js**: Data visualization and analytics charts
- **date-fns**: Date manipulation and formatting utilities
- **clsx & tailwind-merge**: Conditional CSS class management
- **wouter**: Lightweight routing solution for React