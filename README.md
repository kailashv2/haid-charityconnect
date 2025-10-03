# 🤝 HAID CharityConnect

A modern, transparent charity platform that connects people in need with those who want to help. Built with React, TypeScript, Express.js, and PostgreSQL.

![HAID CharityConnect](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## ✨ Features

### 🎯 Core Functionality
- **Item Donations**: Donate physical items like food, clothing, books, and medical supplies
- **Monetary Donations**: Secure financial contributions for specific causes
- **Needy Registration**: Register individuals or families in need of assistance
- **Real-time Analytics**: Live dashboard showing donation impact and statistics
- **Transparent Tracking**: Full visibility into where donations go and their impact

### 🎨 User Experience
- **Modern UI**: Clean, professional design matching HAID standards
- **Dark Mode**: Full dark/light theme support with system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Animated Carousel**: Beautiful image slideshow showcasing charity work
- **Real-time Updates**: Live data updates every 30 seconds

### 🔧 Technical Features
- **Full-stack TypeScript**: Type-safe development across frontend and backend
- **PostgreSQL Database**: Robust data storage with Drizzle ORM
- **RESTful API**: Clean API endpoints for all functionality
- **Image Management**: Local asset serving for custom charity images
- **Environment Configuration**: Secure environment variable management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (we use Neon.tech)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/haid-charityconnect.git
   cd haid-charityconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   NODE_ENV="development"
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🏗️ Project Structure

```
CharityConnect/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express.js application
│   ├── routes.ts          # API route definitions
│   ├── db.ts             # Database configuration
│   └── index.ts          # Server entry point
├── attached_assets/       # Local images and assets
└── README.md
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/analytics` - Get donation statistics
- `GET /api/donations` - Get all donations
- `POST /api/donations/items` - Create item donation
- `POST /api/donations/monetary` - Create monetary donation
- `GET /api/needy-persons` - Get registered needy persons
- `POST /api/needy-persons` - Register new needy person

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design works on all devices

## 🎨 Design System

- **Colors**: Blue (#3B82F6), Green (#10B981), Purple (#8B5CF6)
- **Typography**: Inter font family
- **Components**: Tailwind CSS with custom components
- **Icons**: Lucide React icons
- **Animations**: Smooth transitions and hover effects

## 📊 Database Schema

### Tables
- `itemDonations` - Physical item donations
- `monetaryDonations` - Financial contributions  
- `needyPersons` - Registered individuals in need
- `analytics` - Aggregated statistics

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
NODE_ENV=development|production
PORT=5000

# Optional: Payment Integration
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform

## 📱 Screenshots

### Light Mode
- Modern, clean interface
- Professional charity branding
- Intuitive navigation

### Dark Mode  
- Full dark theme support
- Consistent styling across all components
- Automatic system preference detection

## 🏆 Impact Tracking

- **Real-time Statistics**: Live donation counts and amounts
- **Transparent Reporting**: See exactly where donations go
- **Community Updates**: Recent activity feed
- **Monthly Trends**: Track donation patterns over time

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by transparent charity practices
- Designed for maximum social impact
- Community-driven development

---

**Made with ❤️ for making a difference in the world**
