
# DentiFlow Management System

## Project Overview

DentiFlow is a comprehensive management system for dental practices that helps streamline operations including inventory management, order processing, and contact management.

## Features

- **User Authentication**: Secure login system using email and password
- **Dashboard**: Overview of key metrics and business insights
- **Inventory Management**: Track dental supplies with detailed item information
- **Order Processing**: Create and manage patient orders
- **Contact Management**: Store and manage patient and supplier information
- **Database Setup**: Admin panel to configure and manage the database

## Technology Stack

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **State Management**: React Context API, TanStack Query
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **APIs**: Supabase Functions

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account - for backend services

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd denti-flow-management

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Environment Variables

The following environment variables are required:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication

The application uses Supabase Authentication with email/password login. In development, you may want to disable email verification in the Supabase Console for easier testing.

## Database Structure

The application uses the following main tables:

- `profiles`: User profile information
- `inventory_items`: Dental supplies inventory
- `contacts`: Patient and supplier contact information

## Deployment

This project can be deployed directly from Lovable by clicking on Share -> Publish.

## Custom Domain

To connect a custom domain to your application, navigate to Project > Settings > Domains in Lovable and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Security

The application implements Row Level Security (RLS) policies in Supabase to ensure data is only accessible to authorized users.

## License

[Specify your license here]

