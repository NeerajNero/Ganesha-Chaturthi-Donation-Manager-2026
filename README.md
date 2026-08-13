# Ganesha Chaturthi Donation Manager 2026 (GU26) 🙏

A beautiful, mobile-first web application built to manage street-wise donations, expenses, and community engagement for the Ganesha Chaturthi festival.

## 🌟 Features

- **Public Dashboard & Wall:** A responsive, animated homepage showing real-time goal progress, top donors, and live updates.
- **Volunteer Collection Portal (`/collect`):** A streamlined mobile interface for volunteers to log door-to-door donations with instant street-progress updates.
- **Admin Dashboard (`/admin`):** Comprehensive tools for admins to track total collections, add expenses, manage volunteers, and moderate content.
- **Community Gallery (`/gallery`):** A paginated photo gallery featuring a slide-up modal (mobile-drawer style), one-way anonymous likes, and public comments.
- **Content Moderation:** Built-in admin workflows to approve or reject public comments before they appear on the gallery.
- **Smart Rate Limiting:** Device fingerprinting ensures users can only like a photo once and limits comment spam, all without requiring public users to log in.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom themes, rich gradients, dynamic micro-animations)
- **Database ORM:** [Prisma](https://www.prisma.io/) 
- **State/Data Fetching:** React Query (`@tanstack/react-query`)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A PostgreSQL or SQLite database (depending on your Prisma schema configuration)

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and configure your database connection string and authentication secrets. Example:

```env
DATABASE_URL="file:./dev.db" # Or your Supabase/Postgres connection string
```

### 3. Database Setup

Push the Prisma schema to your database and generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Design Philosophy

This application was designed with a strict **Mobile-First** approach. Volunteers collecting donations in the field need a fast, intuitive UI on their phones. 

Aesthetics are heavily themed around the festival:
- **Color Palette:** Maroon, Gold, Saffron, and Cream.
- **Typography:** Modern, readable fonts combined with traditional design accents.
- **Micro-interactions:** Custom cubic-bezier slide-up modals, bounce animations on likes, and a responsive loading spinner (the `FestiveSpinner` marigold).

## 🛡️ Moderation & Fingerprinting

To allow seamless public interaction (likes and comments on the gallery) without forcing users to create accounts, the app uses a device fingerprinting technique stored in `localStorage`. 
- **Likes:** Users can only like a photo once per device.
- **Comments:** Submissions are limited to one per photo per day per device. All comments enter a `PENDING` state and require approval via the `/admin/comments` dashboard before becoming public.

## 📜 License

This project is created for community event management.
