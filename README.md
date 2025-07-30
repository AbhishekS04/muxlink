# Muxlink - Your Personalized Link Hub

Muxlink is a customizable, open-source link-in-bio solution that lets you create a personalized landing page for all your important links. It's built with modern web technologies and designed for easy self-hosting and customization.

## Overview

This project provides a simple yet powerful platform to consolidate your online presence. It's perfect for creators, developers, and anyone who wants to share multiple links with their audience through a single, elegant URL. The application features a public-facing profile page and a secure admin panel for managing your content.

## Features

- **Personalized Profile:** Showcase your name, bio, and profile picture.
- **Customizable Backgrounds:** Choose between solid colors, gradients, or image backgrounds with an adjustable overlay.
- **Link Management:** Add, edit, reorder, and delete links to your social media, websites, and other online platforms.
- **Button Management:** Create call-to-action buttons for your most important links.
- **Admin Panel:** A secure, password-protected dashboard to manage your profile, links, and appearance.
- **Live Preview:** See your changes in real-time as you edit your profile in the admin panel.
- **Responsive Design:** Looks great on all devices, from desktops to mobile phones.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (with [Neon](https://neon.tech/) for serverless hosting)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** Simple password-based auth for the admin panel.
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to get a local copy of Muxlink up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [pnpm](https://pnpm.io/) (or your preferred package manager)
- [Git](https://git-scm.com/)
- A [Neon](https://neon.tech/) account for the database.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AbhishekS04/muxlink.git
    cd muxlink
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Database Setup

1.  **Create a new project on Neon.**
2.  From your Neon project dashboard, copy the connection string (it will look like `postgres://...`).
3.  **Create a `.env.local` file** in the root of your project and add your database connection string:

    ```env
    DATABASE_URL="your-neon-connection-string"
    ```

4.  **Run the database schema script:**
    Execute the SQL commands in `scripts/001-create-tables.sql` and the other scripts in that directory in your Neon SQL editor to set up the necessary tables and initial data.

### Running the Development Server

Start the development server with:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view your Muxlink page.
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

## Environment Variables

- `DATABASE_URL`: Your PostgreSQL connection string from Neon.
- `ADMIN_PASSWORD`: The password for accessing the admin panel.

## Deployment

The easiest way to deploy your Muxlink instance is with [Vercel](https://vercel.com/).

1.  Push your cloned repository to your own GitHub account.
2.  Create a new project on Vercel and import your repository.
3.  Vercel will automatically detect that this is a Next.js project.
4.  Add your `DATABASE_URL` and `ADMIN_PASSWORD` as environment variables in the Vercel project settings.
5.  Deploy! Your Muxlink page will be live.

## Project Structure

```
.
├── app/                  # Next.js App Router pages
│   ├── (main)/           # Main application routes
│   ├── admin/            # Admin panel routes
│   └── api/              # API routes
├── components/           # React components
│   ├── admin/            # Components for the admin panel
│   └── ui/               # Reusable UI components (from shadcn/ui)
├── lib/                  # Helper functions and utilities
├── public/               # Static assets (images, fonts, etc.)
├── scripts/              # Database scripts
└── styles/               # Global styles
```

## Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
