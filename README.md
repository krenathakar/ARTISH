# Artish UK — Full-Stack Production Website & Admin Portal

Production-ready business website and administrative management dashboard for **Artish UK**, built with React (Vite), Node.js, Express, Prisma ORM, and MySQL.

---

## Tech Stack Summary

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form Management**: React Hook Form
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js
- **Database ORM**: Prisma ORM (MySQL Database)
- **Authentication**: JWT & bcryptjs
- **Email Notifications**: Nodemailer
- **Media Upload**: Multer + Cloudinary ready

---

## Directory Structure

```
artish-uk/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, WhatsAppButton)
│   │   ├── context/            # AuthContext & SettingsContext
│   │   ├── pages/              # Public & Admin routes (HomePage, AdminDashboardPage, AdminLoginPage, etc.)
│   │   ├── sections/           # Homepage Sections (Hero, Services, Reels, Portfolio, Clients, Process, etc.)
│   │   ├── services/           # Axios API configuration
│   │   ├── utils/              # Dynamic Icon mapping helper
│   │   ├── App.jsx             # Main Router setup
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database models for Admin, Services, Portfolio, Clients, Testimonials, FAQs, Enquiries, Settings, Media
│   │   └── seed.js             # Initial database seed script
│   ├── src/
│   │   ├── config/             # DB & Cloudinary configuration
│   │   ├── controllers/        # REST API request handlers
│   │   ├── middleware/         # Auth, Upload, Error handling
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Nodemailer email notification service
│   │   └── server.js           # Main Express server entry point
│   ├── uploads/                # Local uploads fallback directory
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server (running on port 3306)

### 2. Environment Variables Configuration

Create `server/.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/artish_uk"
JWT_SECRET="artish_uk_jwt_secret_key_2026_change_in_production"
PORT=5000
CLIENT_URL="http://localhost:5173"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM="Artish UK <noreply@artish.uk>"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation & Initial Database Seed

### 1. Install Backend Dependencies & Seed Database
```bash
cd server
npm install
npx prisma generate
npx prisma db push
npm run seed
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## Running Development Servers

### Start Express Backend (Port 5000)
```bash
cd server
npm run dev
```

### Start React Vite Frontend (Port 5173)
```bash
cd client
npm run dev
```

---

## Default Admin Credentials
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@artish.uk`
- **Password**: `admin123`

---

## REST API Overview

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Admin login |
| `/api/services` | `GET` | Public | Get active services |
| `/api/services` | `POST` | Admin | Create a service |
| `/api/portfolio` | `GET` | Public | Get published projects |
| `/api/portfolio` | `POST` | Admin | Create a portfolio project |
| `/api/clients` | `GET` | Public | Get featured client spotlights |
| `/api/testimonials` | `GET` | Public | Get client testimonials |
| `/api/faqs` | `GET` | Public | Get FAQs |
| `/api/enquiries` | `POST` | Public | Submit consultation form |
| `/api/enquiries` | `GET` | Admin | Manage leads & change status |
| `/api/settings` | `GET/PUT` | Public/Admin | Dynamic site configuration |
| `/api/media` | `POST` | Admin | Upload images/videos |

---

## Production Build Verification
To test production builds:
```bash
# Build Frontend
cd client
npm run build

# Start Backend in production
cd ../server
NODE_ENV=production npm start
```
