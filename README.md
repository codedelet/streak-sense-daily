
# HabitVault - Daily Habit Tracker

A minimalist habit tracking application focused on helping users build consistent habits with visual feedback, streak tracking, and analytics.

## Features

- User authentication
- Create and manage habits
- Daily habit check-ins
- Streak tracking
- Visual habit calendar/heatmap
- Analytics dashboard
- Dark mode support
- Daily motivational quotes

## Tech Stack

- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Shadcn/UI for component library
- Recharts for data visualization
- React Query for data management
- Local storage for data persistence

## Deployment

### Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open [http://localhost:8080](http://localhost:8080) in your browser

### Deploying to Netlify

#### Option 1: Deploy via Netlify UI

1. Build your project locally: `npm run build`
2. Go to [Netlify](https://app.netlify.com/)
3. Drag and drop your `dist` folder to the Netlify dashboard
4. Your site will be deployed with a Netlify subdomain

#### Option 2: Deploy via Git

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Connect to your Git provider and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

#### Important Configuration for React Router

Since this app uses React Router with client-side routing, add a `_redirects` file in the public directory with the following content:

```
/*    /index.html   200
```

This ensures that all routes redirect to index.html, allowing React Router to handle client-side routing.
