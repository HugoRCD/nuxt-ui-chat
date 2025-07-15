![Nuxt UI Chat](public/banner.jpg)

# Nuxt UI Chat

A modern, full-featured AI chatbot application built with Nuxt 3, Nuxt UI Pro, and the Vercel AI SDK v5. Features real-time streaming, multiple AI models support via AI Gateway, persistent chat history with PostgreSQL, and a beautiful responsive interface.

## Features

- ⚡️ **Streaming AI responses** powered by [Vercel AI SDK v5](https://ai-sdk.dev)
- 🤖 **Multiple AI models** support via [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) - access OpenAI, Anthropic, Google, and more
- 🧠 **Reasoning models** support for advanced problem-solving capabilities
- 🧩 **Generative UI** - AI can generate interactive components (e.g., weather widgets)
- 🔐 **GitHub authentication** via [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)
- 💾 **Persistent chat history** with PostgreSQL and [Drizzle ORM](https://orm.drizzle.team)
- 🎨 **Beautiful UI** built with [Nuxt UI Pro](https://ui.nuxt.com/pro) components
- ⚡ **Real-time syntax highlighting** with Shiki
- 📱 **Responsive design** optimized for all devices
- ⌨️ **Keyboard shortcuts** and command palette
- 🔍 **Chat search** and management

## Tech Stack

- **Frontend**: Nuxt, Nuxt UI Pro, TailwindCSS
- **AI**: Vercel AI SDK v5, Vercel AI Gateway
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: GitHub OAuth via nuxt-auth-utils
- **Deployment**: Vercel (recommended)

## Quick Start

```bash
git clone <your-repo-url>
cd nuxt-ui-chat
pnpm install
```

## Setup

### Environment Variables

Create a `.env` file with the following variables:

```env
# GitHub OAuth (create at https://github.com/settings/applications/new)
NUXT_OAUTH_GITHUB_CLIENT_ID=<your-github-oauth-app-client-id>
NUXT_OAUTH_GITHUB_CLIENT_SECRET=<your-github-oauth-app-client-secret>

# Database (recommended: Neon PostgreSQL)
DATABASE_URL=<your-postgresql-connection-string>

# Vercel AI Gateway (optional but recommended for analytics and caching)
AI_GATEWAY_API_KEY=<your-vercel-ai-gateway-api-key>

# Nuxt UI Pro License (required for production)
NUXT_UI_PRO_LICENSE=<your-nuxt-ui-pro-license>
```

### Database Setup

We recommend using [Neon](https://neon.tech) for PostgreSQL hosting, especially with Vercel's integration:

1. Create a Neon account and database
2. Copy the connection string to `DATABASE_URL`
3. Run database migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### AI Gateway Setup (Optional)

For better analytics, caching, and cost optimization:

1. Create a [Vercel AI Gateway](https://ai-sdk.dev/docs/ai-gateway)
2. Add the API key to `AI_GATEWAY_API_KEY`

## Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Production

Build for production:

```bash
pnpm build
```

Preview production build locally:

```bash
pnpm preview
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Ensure Neon integration is set up for the database
4. Deploy!

### Other Platforms

This app can be deployed on any platform that supports Node.js and PostgreSQL:

- Railway
- DigitalOcean App Platform
- Self-hosted with Docker

## Database Commands

```bash
# Generate new migration after schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

TODO:
- [x] Basic rate limit
- [ ] Better rate limit handling
- [x] Better rate limit handling in the UI (display)
- [ ] Web search with sources display
- [ ] Abort streaming
- [ ] Resume streaming on page reload
- [ ] Image generation
- [ ] Add image to message
- [ ] Change model during conversation

## License

This project requires a [Nuxt UI Pro license](https://ui.nuxt.com/pro) for production use.

## Contributing

Feel free to contribute by opening issues or submitting pull requests!
