# BizSim Quickstart Guide

This guide will help you get the BizSim business simulation dashboard up and running in your local development environment.

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Git
- npm or yarn

## Environment Setup

1. **Clone the Repository**
```bash
git clone [repository-url]
cd qwikbiz
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
NEXT_PUBLIC_NEWS_API_KEY="your-news-api-key"
DATABASE_URL="postgresql://user:password@localhost:5432/bizsim"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Database Setup**
```bash
# Start PostgreSQL
docker-compose up -d

# Run migrations
npx prisma migrate dev
```

## Development Server

1. **Start the Development Server**
```bash
npm run dev
```
The application will be available at http://localhost:3000

2. **View Database UI (Optional)**
```bash
npx prisma studio
```
Access the Prisma Studio interface at http://localhost:5555

## Project Structure

```
src/
  ├── app/              # Next.js pages and layouts
  ├── components/       # React components
  │   └── dashboard/    # Dashboard-specific components
  ├── lib/             # Utility functions and services
  │   ├── services/    # API services
  │   └── utils/       # Helper functions
  ├── types/           # TypeScript definitions
  └── prisma/          # Database schema and migrations
```

## Key Components

### Dashboard Components
- `Dashboard.tsx` - Main dashboard container
- `KPICard.tsx` - Individual KPI display
- `DepartmentSlider.tsx` - Department metrics
- `ScenarioSection.tsx` - Business scenario display
- `NewsTicker.tsx` - Real-time news feed

### Services
- `ai.ts` - Google Gemini API integration
- `news.ts` - TheNews API integration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

## API Integration

### Google Gemini API
The AI service (`src/lib/services/ai.ts`) handles:
- Scenario generation
- Solution impact analysis
- Special projects recommendations

### TheNews API
The news service (`src/lib/services/news.ts`) handles:
- Real-time business news fetching
- News filtering and formatting

## Development Workflow

1. **Feature Development**
   - Create a new branch: `feature/your-feature-name`
   - Implement changes
   - Add tests if necessary
   - Create a pull request

2. **Testing**
   - Run linting: `npm run lint`
   - Run tests: `npm run test`
   - Test in development: `npm run dev`

3. **Database Changes**
   - Update schema in `prisma/schema.prisma`
   - Run `npx prisma migrate dev --name your-migration-name`
   - Test migrations locally

## Common Issues and Solutions

### Database Connection Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d
npx prisma migrate reset
```

### API Rate Limiting
- Implement caching for frequent requests
- Use exponential backoff for retries

### Next.js Build Errors
- Clear `.next` directory: `rm -rf .next`
- Clean install dependencies: `rm -rf node_modules && npm install`

## Best Practices

1. **Code Style**
   - Follow ESLint configurations
   - Use TypeScript strict mode
   - Document complex functions

2. **Component Structure**
   - Keep components focused and single-responsibility
   - Use proper type definitions
   - Implement error boundaries

3. **State Management**
   - Use React hooks effectively
   - Implement proper cleanup in useEffect
   - Optimize rerenders with useMemo/useCallback

## Getting Help

- Check the Engineering Journal in `docs/engineering/JOURNAL.md`
- Review the architecture documentation in `docs/architecture/`
- Consult the codebase roadmap in project documentation

## Next Steps

After getting the basic setup running:
1. Review the complete documentation
2. Understand the architecture
3. Set up your IDE with recommended extensions
4. Join the development discussion
