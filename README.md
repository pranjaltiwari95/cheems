]# Cheems - Dog Adoption System

[**🚀 Live Demo**](https://drive.google.com/file/d/18aHFTOPm1mTkWwcOBosfw7ZK6W0ASDwH/view?usp=sharing) - [**📖 Documentation**](https://drive.google.com/file/d/1rWV601ffCnIpO6jWVwKfnVu_rQV-ip2g/view?usp=drive_link) - [**🐛 Report Bug**](https://www.linkedin.com/in/reachpranjaltiwari/) - [**💡 Request Feature**](https://www.linkedin.com/in/reachpranjaltiwari/)

**Made with ❤️ for dogs and their future families**

---

## About The Project

Cheems is a comprehensive dog adoption platform that streamlines the adoption process by connecting potential adopters with animal shelters. Built with modern web technologies, it provides an intuitive interface for browsing available dogs, real-time communication between adopters and shelters, and efficient adoption management.

## Key Features

- **Secure Authentication** - User registration and login with Clerk
- **Dual User Roles** - Separate interfaces for adopters and shelter administrators
- **Dog Listings** - Comprehensive dog profiles with photos and details
- **Real-time Chat** - Instant messaging between adopters and shelters
- **Responsive Design** - Mobile-first approach with modern UI components
- **Real-time Updates** - Live data synchronisation across all devices
- **Modern UI** - Clean, accessible design with ShadCN components

---

## Built With

## Frontend

- [**Next.js 15**](https://nextjs.org/) - React framework with App Router
- [**React 19**](https://react.dev/) - UI library with latest features
- [**TypeScript**](https://www.typescriptlang.org/) - Type safety and developer experience
- [**ShadCN UI**](https://ui.shadcn.com/) - High-quality UI components
- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework
- [**Radix UI**](https://www.radix-ui.com/) - Unstyled, accessible components

## Backend & Services

- [**Convex**](https://convex.dev/) - Backend-as-a-Service with real-time database
- [**Clerk**](https://clerk.com/) - Authentication and user management
- [**Vercel**](https://vercel.com/) - Deployment and hosting platform

## Development Tools

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Zod** - Schema validation
- **React Hook Form** - Form handling and validation

---

## Architecture

The system implements a **Layered Architecture Pattern** with the following structure:

`┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│    Next.js Frontend + ShadCN UI         │
│   (React Components, Client Logic)      │
└─────────────────┬───────────────────────┘
                  │ HTTP/API Calls
┌─────────────────▼───────────────────────┐
│         APPLICATION LAYER               │
│       Next.js API Routes                │
│  (Business Logic, Validation)           │
└─────────────────┬───────────────────────┘
                  │ Database Operations
┌─────────────────▼───────────────────────┐
│         DATA ACCESS LAYER               │
│          Convex Backend                 │
│   (Database, Real-time Subscriptions)   │
└─────────────────┬───────────────────────┘
                  │ External API Calls
┌─────────────────▼───────────────────────┐
│       EXTERNAL SERVICES LAYER           │
│   Clerk (Auth), File Storage (Images)   │
└─────────────────────────────────────────┘`

---

## Getting Started

## Prerequisites

Make sure you have Node.js version >= 18.17.0 installed on your machine.

`bashnode -v`

## Installation

1. **Clone the repository**
    
    `bashgit clone https://github.com/pranjaltiwari95/cheems.git
    cd cheems`
    
2. **Install dependencies**
    
    `bashnpm install
    *# or*
    yarn install
    *# or*
    pnpm install`
    
3. **Set up environment variables**
    
    Create a `.env.local` file in the root directory and add:
    
    `# Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    
    # Convex Backend
    NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
    CONVEX_DEPLOY_KEY=your_convex_deploy_key`
    
4. **Set up Convex**
    
    `bashnpx convex dev`
    
5. **Start the development server**
    
    `bashnpm run dev
    *# or*
    yarn dev
    *# or*
    pnpm dev`
    
6. **Open your browser**
    
    Navigate to [http://localhost:3000](http://localhost:3000/) to see the application.
    

---

## Usage

## For Adopters

1. **Sign Up** - Create an account and select "Adopter" role
2. **Set Location** - Add your city for location-based dog suggestions
3. **Browse Dogs** - View available dogs with detailed profiles
4. **Contact Shelters** - Use real-time chat to communicate with shelters
5. **Submit Requests** - Apply for adoption through the platform

## For Shelters

1. **Register** - Create an account and select "Shelter" role
2. **Setup Profile** - Add shelter information and location
3. **Manage Listings** - Create, update, and manage dog listings
4. **Communicate** - Respond to adopter inquiries via real-time chat
5. **Track Applications** - Monitor and manage adoption requests

---

## Project Structure

`cheems/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # User dashboards
│   ├── dogs/              # Dog listing pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (ShadCN)
│   ├── auth/             # Authentication components
│   ├── dogs/             # Dog-related components
│   └── chat/             # Chat components
├── convex/               # Backend functions and schema
│   ├── _generated/       # Auto-generated types
│   ├── users.ts          # User management functions
│   ├── dogs.ts           # Dog management functions
│   └── messages.ts       # Chat functionality
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles`

---

## Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

## Deploy Your Own

1. **Fork this repository**
2. **Deploy to Vercel**
3. **Configure Environment Variables**
    
    Add the required environment variables in your Vercel dashboard
    
4. **Deploy Convex Backend**
    
    `bashnpx convex deploy --prod`
    

---

## Future Enhancements

## Phase 2

- **Mobile App** - React Native iOS and Android applications
- **AI Matching** - Machine learning for adopter-dog compatibility
- **Payment Integration** - Stripe integration for adoption fees
- **Analytics Dashboard** - Detailed insights for shelters

## Phase 3

- **Multi-language Support** - Internationalization
- **Veterinary Integration** - Health records and appointments
- **Push Notifications** - Real-time mobile alerts
- **Community Features** - Reviews, success stories, and social sharing

---

## License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## Authors

**Pranjal Tiwari, Saumya Shah**

- GitHub: [@pranjaltiwari95](https://github.com/pranjaltiwari95), [@Saumya13-5](https://github.com/Saumya13-5)
- LinkedIn: [Pranjal Tiwari](https://www.linkedin.com/in/reachpranjaltiwari/), [@Saumya Shah](https://www.linkedin.com/in/saumya-shah-54577a256/)
- Email: [pranjaltiwari185@gmail.com](mailto:pranjaltiwari185@gmail.com), [saumyashah130504@gmail.com](mailto:saumyashah130504@gmail.com)

---

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Convex](https://convex.dev/) for the powerful backend platform
- [Clerk](https://clerk.com/) for authentication services
- [ShadCN](https://ui.shadcn.com/) for beautiful UI components
- [Vercel](https://vercel.com/) for seamless deployment

---
