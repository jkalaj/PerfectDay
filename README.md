# Perfect Day

Perfect Day is a revolutionary productivity app that helps you track your day, manage tasks, build routines, and monitor your mood patterns to create your perfect day, every day.

## Features

- **Task Management**: Create, organize, and track your tasks with priorities and categories
- **Mood Tracking**: Log your moods throughout the day to identify patterns and improve wellbeing
- **Daily Routines**: Build and maintain healthy habits with customizable routines
- **Dashboard**: Get a quick overview of your day with tasks, moods, and progress at a glance
- **Adaptable Views**: Switch between daily, weekly, and monthly views to plan effectively
- **Dark Mode**: Easy on the eyes with full light/dark mode support

## Technologies Used

- **Next.js 14**: React framework with App Router for both frontend and API routes
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For responsive and beautiful UI components
- **Prisma**: Type-safe ORM for database access
- **SQLite**: Simple database storage (can be scaled to PostgreSQL)
- **Zustand**: Lightweight state management
- **Framer Motion**: For smooth animations and transitions
- **Headless UI**: Accessible UI components
- **Heroicons**: Beautiful SVG icons
- **date-fns**: Modern date manipulation library

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma db push
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
perfect-day/
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/               # App router pages and API routes
│   │   ├── api/           # API endpoints
│   │   ├── dashboard/     # Dashboard page
│   │   ├── tasks/         # Tasks page
│   │   └── ...            # Other pages
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Layout components
│   │   ├── tasks/         # Task-related components
│   │   ├── mood/          # Mood-related components
│   │   └── ...            # Other components
│   ├── lib/               # Utility functions and shared code
│   └── store/             # Zustand store for state management
└── ...                    # Configuration files
```

## Future Enhancements

- User authentication and accounts
- Task sharing and collaboration 
- Calendar integration
- Notifications and reminders
- Data visualization for mood and productivity patterns
- Mobile app with offline support

## License

MIT
