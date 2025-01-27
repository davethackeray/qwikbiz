# Atomic Components

This directory contains the most basic building blocks of our UI. These are the smallest possible components that can be reused across the application.

## Guidelines

1. Atoms should be:
   - Single responsibility
   - Highly reusable
   - Stateless when possible
   - Well-documented
   - Thoroughly tested

2. Examples include:
   - Buttons
   - Input fields
   - Icons
   - Labels
   - Loading spinners

## Component Template

```typescript
import React from 'react';

interface ComponentProps {
  // Define props here
}

/**
 * Component description
 * @param props Component properties
 * @returns JSX.Element
 */
export const Component: React.FC<ComponentProps> = (props) => {
  return (
    // JSX here
  );
};
```

## Testing

Each component should have:
- Unit tests
- Accessibility tests
- Visual regression tests (if applicable)

## Performance

Consider:
- Memoization when needed
- Proper prop types
- Minimal re-renders

## Documentation

Each component should include:
- JSDoc comments
- Props documentation
- Usage examples
- Edge cases
