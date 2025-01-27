# Organism Components

Organisms are complex UI components that combine molecules and atoms to create distinct sections of the interface. These components represent more sophisticated parts of the application.

## Guidelines

1. Organisms should:
   - Compose multiple molecules and/or atoms
   - Represent a distinct section of the UI
   - Handle complex interactions
   - Manage their own business logic
   - Integrate with application state when needed

2. Examples include:
   - Navigation bars
   - Form sections
   - Data tables
   - Dashboard widgets
   - Card lists
   - Comment sections

## Component Structure

```typescript
import React from 'react';
import { useEffect } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { useBusinessMetrics } from '../../hooks/useBusinessMetrics';

interface OrganismProps {
  // Define props here
}

/**
 * Organism description
 * @example
 * <DataTableSection
 *   data={tableData}
 *   onRowSelect={handleRowSelect}
 *   sortable
 *   filterable
 * />
 */
export const OrganismComponent: React.FC<OrganismProps> = ({
  // Props destructuring
}) => {
  // Complex state management
  const { data, loading, error } = useBusinessMetrics();

  // Side effects
  useEffect(() => {
    // Setup and cleanup logic
  }, []);

  // Event handlers and business logic
  const handleComplexInteraction = () => {
    // Complex interaction logic
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <ErrorBoundary>
      {/* Composition of molecules and atoms */}
    </ErrorBoundary>
  );
};
```

## State Management

1. Local State:
   - Complex UI states
   - Form data
   - Interaction states

2. Global State:
   - Application data
   - User preferences
   - Authentication state

3. Side Effects:
   - Data fetching
   - Subscriptions
   - DOM manipulations
   - Cleanup operations

## Testing Strategy

1. Unit Tests:
   - Component rendering
   - Business logic
   - State management
   - Event handling

2. Integration Tests:
   - Data flow
   - Component interactions
   - API integration
   - State updates

3. E2E Tests:
   - Critical user paths
   - Complex interactions
   - Edge cases

## Performance Optimization

1. Data Management:
   - Implement data caching
   - Use pagination/infinite scroll
   - Optimize API calls
   - Handle data updates efficiently

2. Rendering Optimization:
   - Use React.memo
   - Implement virtualization for lists
   - Optimize re-renders
   - Use proper key props

3. Loading States:
   - Implement skeleton loading
   - Show progress indicators
   - Handle partial loading
   - Manage loading priorities

## Error Handling

1. Error Boundaries:
   - Implement error boundaries
   - Show error states
   - Provide recovery options
   - Log errors appropriately

2. Error Prevention:
   - Validate inputs
   - Handle edge cases
   - Provide feedback
   - Implement retry logic

## Documentation

Each organism should include:
- Detailed component documentation
- Business logic explanation
- State management details
- Integration requirements
- Performance considerations
- Error handling approach
- Accessibility guidelines
- Usage examples

## Security Considerations

1. Input Validation:
   - Sanitize user inputs
   - Prevent XSS attacks
   - Handle sensitive data
   - Implement rate limiting

2. Authorization:
   - Check user permissions
   - Handle unauthorized access
   - Protect sensitive actions
   - Audit logging
