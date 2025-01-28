# QwikBiz - Business Simulation Platform

QwikBiz is a real-time business simulation platform that helps users learn and practice business decision-making through interactive scenarios and AI-powered insights.

## Prerequisites

- Node.js >= 18
- npm >= 8
- Git

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/qwikbiz.git
cd qwikbiz
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

### Required Environment Variables

- `APP_URL`: Your application URL (e.g., `http://localhost:3000`)
- `NODE_ENV`: Environment (`development`, `production`, or `test`)

#### Google OAuth Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the OAuth 2.0 API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (type: Web application)
6. Add authorized redirect URIs (e.g., `http://localhost:3000/auth/callback`)
7. Copy the credentials to your .env file:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

#### JWT Configuration
Generate a secure random string for JWT signing (minimum 32 characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add the generated string to your .env file:

```
JWT_SECRET=your-generated-secret
```

4. Verify environment configuration

```bash
npm run verify-env
```

5. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linting
- `npm run verify-env` - Verify environment configuration

## Architecture

The application follows a modular architecture with:

- **Frontend**: Next.js + React + TypeScript
- **Authentication**: Custom JWT implementation with Google OAuth
- **State Management**: React Context + Custom Hooks
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library

### Key Directories

```
src/
├── app/          # Next.js App Router pages and layouts
├── components/   # React components (Atomic Design)
├── context/     # React context providers
├── features/    # Core business logic
├── hooks/       # Custom React hooks
├── lib/         # Utilities and services
└── types/       # TypeScript type definitions
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
