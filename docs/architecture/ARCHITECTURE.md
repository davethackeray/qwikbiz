# BizSim Architecture Documentation

## System Overview

BizSim is a real-time business simulation platform built on a modern web stack. The system combines AI-driven scenario generation with real-time business metrics tracking and user decision analysis.

```mermaid
graph TB
    UI[User Interface]
    AI[AI Service]
    News[News Service]
    DB[(Database)]
    Cache[(Cache)]
    
    UI --> AI
    UI --> News
    UI --> DB
    AI --> Cache
    News --> Cache
```

## Core Components

### 1. Frontend Architecture

The frontend follows atomic design principles, organizing components into a clear hierarchy:

#### Component Hierarchy
```
src/components/
├── atoms/          # Basic building blocks
│   ├── Button
│   └── LoadingSpinner
├── molecules/      # Simple combinations of atoms
│   ├── cards/
│   │   ├── KPICard
│   │   └── SolutionCard
│   ├── NewsItem
│   └── ProgressBar
├── organisms/      # Complex components
│   └── sections/
│       ├── DepartmentSlider
│       ├── NewsTicker
│       └── ScenarioSection
└── templates/      # Page-level layouts
    └── dashboard/
        └── DashboardTemplate
```

#### State Management
- Custom hooks for business logic (useDashboard)
- Local component state for UI interactions
- Error boundaries for error handling
- Loading states and optimistic updates

### 2. Backend Services

#### AI Service Layer
```typescript
interface AIService {
  generateScenario(context: BusinessContext): Promise<Scenario>
  analyzeSolution(solution: Solution): Promise<Impact>
  getSpecialProjectsRecommendation(context: BusinessContext): Promise<Solution>
}
```

#### News Service Layer
```typescript
interface NewsService {
  getLatestNews(): Promise<NewsItem[]>
  filterByRelevance(news: NewsItem[]): NewsItem[]
  updateNewsStream(callback: (news: NewsItem) => void): void
}
```

### 3. Data Model (Prisma Schema)

#### Entity Relationship Diagram
```mermaid
erDiagram
    User ||--o{ UserProfile : has
    User ||--o{ UserDecision : makes
    User ||--o{ BusinessMetrics : tracks
    Scenario ||--o{ Solution : contains
    UserDecision }|--|| Solution : chooses
```

### 4. Component Design Patterns

#### Error Handling
```typescript
// Global error boundary
<ErrorBoundary>
  <Component />
</ErrorBoundary>

// Component-level error states
if (error) {
  return <ErrorState message={error.message} />;
}
```

#### Loading States
```typescript
// Skeleton loading
if (isLoading) {
  return <SkeletonLoader />;
}

// Progress indicators
<LoadingSpinner size={20} text="Processing..." />
```

#### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast compliance

### 5. Custom Hooks

Custom hooks encapsulate complex business logic and state management:

```typescript
// Dashboard state management
const [
  { kpis, departments, news, scenario },
  { handleSolutionSelect, handleSpecialProjects }
] = useDashboard();

// Component-specific hooks
const { data, loading, error } = useNewsStream();
```

## Technical Stack

### 1. Framework Selection

#### Next.js 14
- Server-side rendering
- API routes
- TypeScript support
- File-based routing

### 2. UI Components
- Atomic design structure
- Tailwind CSS for styling
- Component documentation
- Accessibility patterns

### 3. Performance Optimizations

#### Client-side Cache
- Real-time data caching
- Component memoization
- Optimistic updates

#### Loading Strategy
- Progressive loading
- Skeleton interfaces
- Suspense boundaries

## Testing Strategy

### 1. Component Testing
```typescript
describe('Component', () => {
  // Render tests
  it('renders successfully', () => {});

  // Interaction tests
  it('handles user interactions', () => {});

  // State tests
  it('manages state correctly', () => {});
});
```

### 2. Hook Testing
```typescript
import { renderHook } from '@testing-library/react-hooks';

describe('useHook', () => {
  it('manages state correctly', () => {
    const { result } = renderHook(() => useHook());
    expect(result.current).toBeDefined();
  });
});
```

## Future Considerations

### 1. Scaling Strategy
- Component reusability
- Performance monitoring
- Bundle optimization
- Code splitting

### 2. Feature Extensions
- Advanced analytics
- Real-time collaboration
- Mobile responsiveness
- Offline support

## Development Guidelines

### 1. Component Development
- Follow atomic design principles
- Implement error boundaries
- Include loading states
- Write unit tests

### 2. Code Quality
- TypeScript for type safety
- ESLint for code style
- Prettier for formatting
- Jest for testing

### 3. Documentation
- Component documentation
- Code comments
- Type definitions
- Usage examples

## Conclusion

This architecture provides a robust foundation for the BizSim platform while maintaining flexibility for future enhancements and scale. Regular reviews and updates to this document should be performed as the system evolves.

Last updated: January 27, 2025
