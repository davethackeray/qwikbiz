# BizSim

A real-time business simulation platform built with Next.js 14, TypeScript, and atomic design principles.

## Architecture

The application follows atomic design methodology, organizing components into a clear hierarchy:

```
src/
├── components/            # Component library
│   ├── atoms/            # Basic building blocks
│   ├── molecules/        # Simple component combinations
│   ├── organisms/        # Complex components
│   └── templates/        # Page-level layouts
├── hooks/                # Custom React hooks
├── lib/
│   ├── constants/        # Application constants
│   └── services/         # External service integrations
├── types/                # TypeScript definitions
└── app/                  # Next.js pages and routing
```

### Component Organization

- **Atoms**: Fundamental building blocks (Button, LoadingSpinner)
- **Molecules**: Simple combinations (KPICard, ProgressBar)
- **Organisms**: Complex sections (DepartmentSlider, NewsTicker)
- **Templates**: Page layouts (DashboardTemplate)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qwikbiz.git
cd qwikbiz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Development

### Key Features

- Real-time business metrics tracking
- AI-driven scenario generation
- Interactive department management
- Live business news feed

### Code Quality

- TypeScript for type safety
- ESLint for code style
- Jest for testing
- Prettier for formatting

### Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Architecture Guide](docs/architecture/ARCHITECTURE.md)
- [Engineering Rules](docs/engineering/ENGINEERING_RULES.md)
- [Quick Start Guide](docs/guides/QUICKSTART.md)
- [API Documentation](docs/api/README.md)

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Contributing

1. Review the [Engineering Rules](docs/engineering/ENGINEERING_RULES.md)
2. Create a feature branch
3. Follow atomic design principles
4. Add tests for new features
5. Update documentation
6. Submit a pull request

## Directory Structure

```
.
├── docs/                 # Documentation
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── scripts/             # Build and utility scripts
└── src/
    ├── app/            # Next.js app router
    ├── components/     # React components
    ├── hooks/          # Custom React hooks
    ├── lib/            # Utilities and services
    └── types/          # TypeScript types
```

## Performance Considerations

- Server-side rendering
- Component lazy loading
- Image optimization
- API response caching

## Security

- Input validation
- CSRF protection
- Rate limiting
- Secure authentication

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the awesome framework
- Our contributors and maintainers

Last updated: January 27, 2025
