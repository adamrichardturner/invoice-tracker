# Invoice Tracker - Frontend

This is the frontend for an Invoice Tracker application, written in TypeScript and built with Next.js (App Router), Tailwind CSS, and Shadcn.

It interacts with the backend server to manage invoices efficiently, with a smooth client-side routing system and attractive UI.

The backend repository can be found [here](https://github.com/adamrichardturner/invoice-tracker-backend).

![](preview.gif)

## Demo

You can view a live demo of this application [here](https://invoice-tracker.adamrichardturner.dev/).

Visit the URL and click `Try Demo` to explore the application.

## Features

- **Next.js 16**: App Router with React 19 and Turbopack
- **TypeScript**: For type safety and improved developer experience
- **Tailwind CSS**: For utility-first CSS styling
- **Shadcn**: For enhanced UI components and consistent design
- **JWT Authentication**: Cookie-based demo login flow
- **Zustand Store**: Global state management for invoices and UI
- **React Hook Form**: Form handling with Zod schema validation
- **Custom Hooks**: Abstracts API services and state management
- **Axios**: For HTTP requests with credentials
- **Route Protection**: Auth checks via Next.js `proxy`

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Requirements

- Node.js 20.9+
- The [backend API](https://github.com/adamrichardturner/invoice-tracker-backend) running locally (default `http://localhost:3001`)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adamrichardturner/invoice-tracker-frontend.git
   cd invoice-tracker-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables)).

4. **Start the backend**

   In the backend repo, start the API (for example with Docker):

   ```bash
   npm run docker:dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

In development, Next.js rewrites `/user/*` and `/api/*` to the backend so auth cookies work on localhost. Leave `NEXT_PUBLIC_API_URL` empty so the browser uses same-origin requests.

## Environment Variables

### Local development (`.env.local`)

```env
# Leave empty so the browser calls same-origin paths (proxied to the backend).
NEXT_PUBLIC_API_URL=
BACKEND_URL=http://localhost:3001
```

| Variable              | Description                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Public API base URL. Leave empty in local dev so requests stay same-origin and cookies work with the rewrite proxy. |
| `BACKEND_URL`         | Backend origin used by Next.js rewrites in development only (defaults to `http://localhost:3001`).                  |

### Production

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL (for example `https://your-api-host`). Rewrites are disabled in production; the browser calls the API directly and shares the auth cookie via your production domain.

## Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the Next.js development server     |
| `npm run build`    | Create a production build                |
| `npm run start`    | Start the production server on port 3000 |
| `npm run lint`     | Run ESLint                               |
| `npm run lint:fix` | Run ESLint with auto-fix                 |
| `npm run format`   | Format files with Prettier               |

## Usage

The application provides a simple demo login flow:

1. Start the backend and frontend as above
2. Open `http://localhost:3000` and click `Try Demo`
3. Explore the invoice management interface
4. Create, edit, and manage invoices

## Contributing

Contributions are welcome! Please feel free to:

- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Suggest UI/UX enhancements

## License

This project is open source and available under the MIT license.
