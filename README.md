# Levaic Health Management System

A full-stack health management system with MongoDB, Express, React, and Node.js.

## Features

- Clinic management
- Member management
- Consultant management
- Service management
- Authentication and authorization

## Tech Stack

- **Frontend**: React, Bootstrap, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB (Atlas)
- **Deployment**: Vercel

## Deployment

This project is configured for easy deployment on Vercel:

1. Clone this repository
2. Push to your GitHub repository
3. Connect your GitHub repository to Vercel
4. Deploy with the default settings (Vercel will automatically detect the configuration)

## Development Setup

```bash
# Install dependencies
npm install

# Run both frontend and backend in development mode
npm run dev

# Build for production
npm run build
```

## Environment Variables

The following environment variables are required:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `NODE_ENV`: Set to "production" for production deployment

## Project Structure

- `/frontend`: React frontend application
- `/backend`: Node.js backend API
- `vercel.json`: Vercel deployment configuration

## License

ISC 