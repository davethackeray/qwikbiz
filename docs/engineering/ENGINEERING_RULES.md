# Engineering Rules and Standards

## 1. Code Organization

### Directory Structure
```
src/
  ├── components/    // Atomic design pattern
  │   ├── atoms/     // Basic building blocks (buttons, inputs)
  │   ├── molecules/ // Simple combinations (form fields, cards)
  │   ├── organisms/ // Complex combinations (forms, sections)
  │   └── templates/ // Page layouts
  ├── hooks/         // Custom React hooks
  ├── context/       // React context providers
  ├── lib/
  │   ├── services/  // External service integrations
  │   ├── utils/     // Shared utilities
  │   └── constants/ // Application constants
  └── types/         // TypeScript definitions
```

## 2. Component Standards

### Requirements
- Every component must have:
  ```typescript
  // TypeScript interface for props
  interface ComponentProps {
    // Required props
    required: string;
    // Optional props with '?'
    optional?: number;
  }

  // Error handling
  try {
    // Component logic
  } catch (error) {
    // Error reporting
    reportError(error);
    // Fallback UI
    return <ErrorState />;
  }

  // Loading states
  if (isLoading) {
    return <LoadingSpinner />;
  }
  ```

### Performance Guidelines
- Implement React.memo for expensive components
- Use useMemo for complex calculations
- Implement useCallback for function props
- Avoid unnecessary re-renders
- Lazy load components when possible

### Dependency Injection
- Classes should accept dependencies via the constructor to facilitate testing and maintainability.
- Example: `MarketSimulator` class now accepts `DepartmentNetwork`, `EventProcessor`, and `MetricsAggregator` via the constructor.

### Documentation
- Include JSDoc comments for all components
- Document props with TypeScript interfaces
- Add usage examples in comments
- Include performance considerations
- Document any side effects

## 3. Real-Time Simulation Standards

### Performance Requirements
1. Event Processing:
   - Process events within 200ms
   - Maintain event ordering
   - Handle high-frequency updates
2. State Management:
   - Cache metrics for fast access
   - Implement window-based history
   - Optimize memory usage
3. Cross-Department Effects:
   - Track dependency chains
   - Prevent circular effects
   - Apply impact calculations

### Implementation Pattern
```typescript
class SimulationComponent {
  // Use dependency injection
  constructor(dependencies: Dependencies) {
    this.validateDependencies(dependencies);
    this.initializeState();
  }

  // Implement clear state management
  private initializeState(): void {
    this.state = {
      currentTick: 0,
      events: [],
      metrics: new Map()
    };
  }

  // Handle real-time updates
  processRealTimeEvents(events: Event[]): void {
    const start = Date.now();
    try {
      this.validateEvents(events);
      this.updateState(events);
      this.notifyListeners();
    } catch (error) {
      this.handleError(error);
    }
    this.checkPerformance(Date.now() - start);
  }

  // Monitor performance
  private checkPerformance(duration: number): void {
    if (duration > 200) {
      console.warn(`Performance threshold exceeded: ${duration}ms`);
    }
  }
}
```

### Testing Requirements
1. Performance testing:
   - Response time validation
   - Memory usage monitoring
   - Load testing
2. State validation:
   - Data consistency checks
   - Cross-department effects
   - Error scenarios
3. Integration testing:
   - Component interaction
   - Event flow validation
   - System stability

## 4. Error Handling

### Guidelines
1. Use TypeScript for type safety
2. Implement error boundaries
3. Log errors to monitoring service
4. Provide user-friendly error messages
5. Include error recovery mechanisms

### Error Boundary Implementation
```typescript
class ComponentErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    logError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## 4. State Management

### Guidelines
1. Use React Context for global state
2. Implement custom hooks for reusable state logic
3. Use local state for component-specific data
4. Optimize re-renders with proper state structure
5. Implement proper state initialization

### Example Pattern
```typescript
// Create context
const BusinessContext = createContext<BusinessState>(null!);

// Create provider
export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(businessReducer, initialState);
  
  return (
    <BusinessContext.Provider value={{ state, dispatch }}>
      {children}
    </BusinessContext.Provider>
  );
}

// Create hooks
export function useBusinessMetrics() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessMetrics must be used within BusinessProvider');
  }
  return context;
}
```

## 5. Service Layer Standards

### Requirements
1. Implement retry logic
2. Add request/response logging
3. Handle timeouts
4. Use TypeScript for type safety
5. Implement circuit breaker pattern

### Example Pattern
```typescript
class ServiceBase {
  async request<T>(config: RequestConfig): Promise<T> {
    try {
      // Implement retry logic
      return await this.executeWithRetry(config);
    } catch (error) {
      // Log error
      // Implement circuit breaker
      throw this.handleError(error);
    }
  }
}
```

## 6. Testing Standards

### Requirements
1. Unit tests for all components
2. Integration tests for services
3. E2E tests for critical paths
4. Performance testing
5. Accessibility testing

### Test Structure
```typescript
describe('Component', () => {
  // Setup
  beforeEach(() => {
    // Setup test environment
  });

  // Happy path
  it('should render successfully', () => {
    // Test implementation
  });

  // Error cases
  it('should handle errors', () => {
    // Test error scenarios
  });

  // Edge cases
  it('should handle edge cases', () => {
    // Test edge cases
  });
});
```

## 7. Performance Standards

### Requirements
1. Core Web Vitals targets:
   - LCP: < 2.5s
   - FID: < 100ms
   - CLS: < 0.1
2. API response time < 200ms
3. Bundle size limits:
   - Initial JS < 100KB
   - Initial CSS < 20KB
4. Memory usage monitoring

### Optimization Techniques
- Implement code splitting
- Use React.Suspense
- Optimize images
- Implement caching
- Use service workers

## 8. Security Standards

### Requirements
1. Input validation
2. XSS prevention
3. CSRF protection
4. Rate limiting
5. Secure authentication

### Implementation
```typescript
// Input validation
const validateInput = (input: unknown): boolean => {
  // Implement validation logic
  return true;
};

// XSS prevention
const sanitizeContent = (content: string): string => {
  // Implement sanitization
  return content;
};
```

## 9. Documentation Standards

### Requirements
1. README.md for each directory
2. JSDoc comments for functions
3. TypeScript interfaces
4. API documentation
5. Architecture diagrams

### Example
```typescript
/**
 * Component description
 * @param {ComponentProps} props - Component props
 * @returns {JSX.Element} Rendered component
 * @example
 * <Component prop="value" />
 */
```

## 10. Code Review Checklist

### Before Submitting
1. Run all tests
2. Check TypeScript errors
3. Run linter
4. Check performance impact
5. Update documentation

### Review Criteria
1. Code quality
2. Test coverage
3. Performance impact
4. Security considerations
5. Documentation quality

## Conclusion

These engineering rules and standards are designed to ensure code quality, maintainability, and scalability. They should be reviewed and updated regularly as the project evolves.

Remember:
- Follow the principle of least surprise
- Write self-documenting code
- Maintain consistent patterns
- Consider edge cases
- Think about scalability
