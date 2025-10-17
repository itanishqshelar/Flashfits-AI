# Flashfits AI - Fashion E-commerce Platform

A modern, AI-powered fashion e-commerce web application built with Next.js, React, and Supabase. Flashfits AI offers a seamless shopping experience with intelligent product recommendations and a sleek, responsive design.

![Fashion Banner](public/ai-fashion-hero.png)

## 🌟 Features

- **Modern E-commerce Experience**: Browse and shop fashion items with an intuitive interface
- **AI-Powered Fashion Chatbot**: Interactive styling assistant using Google Gemini AI
- **Product-Aware AI**: Chatbot has access to your product catalog for personalized recommendations
- **Smart Style Recommendations**: AI-driven product suggestions based on user preferences
- **Admin Dashboard**: Easy product management with CRUD operations
- **User Authentication**: Secure login/logout functionality via Supabase Auth
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Image Management**: Secure image upload and storage via Supabase Storage
- **Real-time Database**: Live product updates with Supabase
- **Dark/Light Mode**: Theme switching capability

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (Database, Auth, Storage)
- **AI Integration**: Google Gemini AI for fashion styling assistance
- **State Management**: React Context API
- **Package Manager**: npm
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) package manager (comes with Node.js)
- A [Supabase](https://supabase.com/) account

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/itanishqshelar/Flashfits-AI.git
cd Flashfits-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Get your Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file

### 4. Set up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com/)
2. Run the database schema located in `/scripts/schema.sql`
3. Optionally, seed the database with sample products using `/scripts/seed-products-extended.sql`

### 5. Configure Supabase Storage

1. Create a new storage bucket called `products`
2. Set the bucket policy to allow authenticated users to upload images

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
flashfits-fashion-webapp/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── ai/                # AI features page
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart
│   ├── login/             # Authentication
│   └── shop/              # Product catalog
├── components/            # Reusable React components
│   └── ui/                # UI components (buttons, cards, etc.)
├── contexts/              # React Context providers
├── lib/                   # Utility functions and configurations
│   └── supabase/          # Supabase client configuration
├── public/                # Static assets
├── scripts/               # Database scripts
└── styles/                # Global CSS styles
```

## 🔑 Environment Variables

| Variable                        | Description                   |
| ------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key   |
| `GEMINI_API_KEY`                | Your Google Gemini AI API key |

## 📱 Pages Overview

- **Home** (`/`): Landing page with featured products
- **Shop** (`/shop`): Product catalog with filtering
- **Cart** (`/cart`): Shopping cart management
- **AI** (`/ai`): AI-powered fashion recommendations
- **About** (`/about`): About the platform
- **Login** (`/login`): User authentication
- **Admin** (`/admin/add-product`): Product management (admin only)

## 🛒 Key Features

### AI Fashion Chatbot

- Interactive styling assistant powered by Google Gemini AI
- Access to your complete product catalog
- Personalized outfit recommendations
- Fashion advice and styling tips
- Natural conversation interface

### Product Management

- Add new products with images
- Edit product details
- Delete products
- Image upload to Supabase Storage

### Shopping Cart

- Add items to cart
- Update quantities
- Remove items
- Persistent cart state

### Authentication

- User registration and login
- Protected admin routes
- Session management

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/itanishqshelar/Flashfits-AI)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Alternative Deployment Options

- **Netlify**: Connect your GitHub repo and deploy
- **Railway**: Simple deployment with database included
- **AWS Amplify**: Full-stack deployment on AWS

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Image uploads may take time on slower connections
- Cart state resets on page refresh (consider implementing persistent storage)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# <<<<<<< HEAD

## 👨‍💻 Author

**Tanishq Shelar** - [@itanishqshelar](https://github.com/itanishqshelar)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Vercel](https://vercel.com/) for hosting and deployment

## 🔗 Links

- [Live Demo](https://flashfits-ai.vercel.app)
- [Project Repository](https://github.com/itanishqshelar/Flashfits-AI)
- [Bug Reports](https://github.com/itanishqshelar/Flashfits-AI/issues)
  > > > > > > > a5278ed (feat: Add AI Fashion Chatbot with Gemini API integration)

---

⭐ Star this repository if you find it helpful!

## Development Notes

This project was built with [v0.app](https://v0.app) assistance and can be automatically synced with v0 deployments.
