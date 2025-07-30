# BlogSite - Full Stack Blog Platform

A modern blog platform built with Next.js (frontend) and C# .NET (backend), designed for easy deployment on Vercel and Railway.

## Features

- 🔐 **User Authentication** - Secure login/registration with JWT tokens
- 📝 **Blog Management** - Create, edit, delete, and view blogs
- 👥 **User Dashboard** - Personal dashboard to manage your blogs
- 🛡️ **Admin Panel** - Admin dashboard to manage all users and posts
- 📱 **Responsive Design** - Mobile-friendly interface with TailwindCSS
- 🚀 **Easy Deployment** - Ready for Vercel (frontend) and Railway (backend)

## Tech Stack

### Frontend

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **React Hook Form** for form handling
- **Axios** for API calls
- **Lucide React** for icons

### Backend

- **C# .NET 9** Web API
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** with BCrypt password hashing
- **Swagger** for API documentation

## Project Structure

```
codex_blogsite/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/ # React components
│   │   ├── contexts/  # React contexts
│   │   ├── services/  # API services
│   │   └── types/     # TypeScript types
│   └── vercel.json    # Vercel deployment config
└── backend/
    └── BlogAPI/       # .NET Web API
        ├── Controllers/ # API controllers
        ├── Models/    # Data models
        ├── Data/      # Database context
        ├── Services/  # Business logic
        ├── Dockerfile # Docker configuration
        └── railway.json # Railway deployment config
```

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- .NET 9 SDK
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend/BlogAPI
   ```

2. Install dependencies:

   ```bash
   dotnet restore
   ```

3. Update the connection string in `appsettings.Development.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=blogdb_dev;Username=your_username;Password=your_password"
     }
   }
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5000` with Swagger documentation at `http://localhost:5000/swagger`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## Default Admin Account

The application creates a default admin account:

- **Email:** admin@blogsite.com
- **Password:** admin123

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Blogs

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/{id}` - Get specific blog
- `GET /api/blogs/my` - Get current user's blogs
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/{id}` - Update blog
- `DELETE /api/blogs/{id}` - Delete blog

### Admin

- `GET /api/admin/users` - Get all users
- `GET /api/admin/blogs` - Get all blogs
- `GET /api/admin/stats` - Get dashboard statistics
- `DELETE /api/admin/users/{id}` - Delete user
- `DELETE /api/admin/blogs/{id}` - Delete blog

## Deployment Options

This project supports multiple deployment strategies:

### 🏆 **Single Platform (Recommended): Render**

Deploy everything to one platform using the included `render.yaml`:

1. Push your code to a Git repository
2. Connect to [Render](https://render.com) as a "Blueprint"
3. Render automatically deploys frontend + backend + database
4. ✅ **One-click deployment!**

### **Specialized Platforms: Vercel + Railway**

For maximum optimization:

#### Backend (Railway)

1. Connect your repository to Railway
2. Add environment variables:
   - `ConnectionStrings__DefaultConnection` - PostgreSQL connection string
   - `Jwt__Key` - JWT secret key (32+ characters)
3. Railway builds using the Dockerfile

#### Frontend (Vercel)

1. Connect your repository to Vercel
2. Add environment variable:
   - `NEXT_PUBLIC_API_URL` - Your backend URL + `/api`
3. Vercel optimizes the Next.js deployment

### **Other Options**

- **DigitalOcean App Platform** - Great performance, managed services
- **Fly.io** - Global edge deployment
- **Google Cloud Run** - Enterprise-grade auto-scaling

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions for each platform.

## Database Setup

The application uses PostgreSQL and will automatically create the database schema on startup. For production, consider using:

- **Railway PostgreSQL** (recommended for Railway backend)
- **Supabase** (free tier available)
- **Neon** (serverless PostgreSQL)

## Features

### User Features

- Register and login with secure authentication
- Create and publish blog posts
- Edit and delete own blog posts
- View personal dashboard with blog statistics
- Browse all published blogs

### Admin Features

- View comprehensive dashboard statistics
- Manage all users (view, delete)
- Manage all blog posts (view, delete)
- Monitor platform activity

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
