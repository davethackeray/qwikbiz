# Quick Start Guide

This guide will help you understand the BizSim project structure and get started with development.

## Project Structure

BizSim follows atomic design principles, organizing components into a clear hierarchy:

```
src/
├── components/            # Component library
│   ├── atoms/            # Basic building blocks
│   │   ├── Button
│   │   └── LoadingSpinner
│   ├── molecules/        # Simple combinations
│   │   ├── cards/
│   │   │   ├── KPICard
│   │   │   └── SolutionCard
│   │   ├── NewsItem
│   │   └── ProgressBar
│   ├── organisms/        # Complex components
│   │   └── sections/
│   │       ├── DepartmentSlider
│   │       ├── NewsTicker
│   │       └── ScenarioSection
│   └── templates/        # Page layouts
│       └── dashboard/
│           └── DashboardTemplate
├── hooks/                # Custom React hooks
├── lib/
│   ├── constants/        # Application constants
│   └── services/         # External service integrations
├── types/                # TypeScript definitions
└── app/                  # Next.js pages
```

## Development Workflow

### 1. Setting Up Your Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/qwikbiz.git
cd qwikbiz

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up the database
npx prisma migrate dev

# Start development server
npm run dev
```

### 2. Creating New Components

Follow the atomic design methodology when creating new components:

#### Atoms (Basic Building Blocks)
```typescript
// src/components/atoms/Button.tsx
export interface ButtonProps {
  // Define props
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button {...props}>
      {children}
    </button>
  );
};
```

#### Molecules (Combinations of Atoms)
```typescript
// src/components/molecules/cards/DataCard.tsx
import { Button } from '../../atoms';

export const DataCard: React.FC<DataCardProps> = ({ title, data }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div>{data}</div>
      <Button>Action</Button>
    </div>
  );
};
```

#### Organisms (Complex Components)
```typescript
// src/components/organisms/sections/DataSection.tsx
import { DataCard } from '../../molecules';

export const DataSection: React.FC = () => {
  return (
    <section>
      <DataCard title="Revenue" data={revenueData} />
      <DataCard title="Growth" data={growthData} />
    </section>
  );
};
```

### 3. Using Custom Hooks

```typescript
import { useDashboard } from '@/hooks/useDashboard';

const YourComponent = () => {
  const [
    { kpis, departments, news },
    { handleSolutionSelect }
  ] = useDashboard();

  return (
    // Your component JSX
  );
};
```

### 4. Error Handling

Always wrap components with error boundaries:

```typescript
import { ErrorBoundary } from '@/components';

const YourComponent = () => {
  return (
    <ErrorBoundary>
      {/* Your component content */}
    </ErrorBoundary>
  );
};
```

### 5. Loading States

Implement loading states for async operations:

```typescript
const YourComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    // Your component content
  );
};
```

### 6. Component Documentation

Document your components using JSDoc comments:

```typescript
/**
 * Component description
 * @example
 * <YourComponent
 *   prop1="value"
 *   prop2={42}
 * />
 */
export interface YourComponentProps {
  /** Description of prop1 */
  prop1: string;
  /** Description of prop2 */
  prop2: number;
}
```

## Best Practices

1. **Component Organization**
   - Place components in appropriate atomic design categories
   - Use index files for clean exports
   - Keep components focused and single-responsibility

2. **State Management**
   - Use custom hooks for complex logic
   - Keep state close to where it's used
   - Implement proper cleanup in useEffect

3. **Styling**
   - Use Tailwind CSS utility classes
   - Follow responsive design principles
   - Maintain consistent spacing and layout

4. **Testing**
   - Write unit tests for components
   - Test error states and edge cases
   - Mock external dependencies

5. **Performance**
   - Implement proper memoization
   - Use lazy loading when appropriate
   - Optimize re-renders

## Common Tasks

### Adding a New Feature

1. Plan the component hierarchy
2. Create necessary atomic components
3. Implement custom hooks if needed
4. Add TypeScript interfaces
5. Write tests
6. Update documentation

### Modifying Existing Components

1. Review the component's current implementation
2. Make changes following atomic design principles
3. Update tests and documentation
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Component Not Rendering**
   - Check error boundaries
   - Verify prop types
   - Check for runtime errors

2. **State Updates Not Working**
   - Verify hook dependencies
   - Check state update logic
   - Ensure proper cleanup

3. **Type Errors**
   - Review TypeScript interfaces
   - Check import paths
   - Verify prop types

## Additional Resources

- [Architecture Documentation](../architecture/ARCHITECTURE.md)
- [Engineering Rules](../engineering/ENGINEERING_RULES.md)
- [Component Standards](../engineering/DOCUMENTATION_STANDARDS.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
