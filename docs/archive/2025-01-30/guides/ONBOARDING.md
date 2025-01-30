# AI Agent Onboarding Guide

This documentation is specifically designed for AI coding agents interfacing with the QwikBiz codebase. Human developers should refer to the development team for appropriate access and setup instructions.

## System Access Patterns

As an AI agent, you have:
- Direct access to workspace files
- Environment variable reading capabilities
- Project configuration parsing
- Documentation traversal abilities

## Workspace Navigation

### File Structure Access
```
/
├── src/                    # Source code
├── docs/                   # Documentation
├── prisma/                # Database schema
└── public/                # Static assets
```

### Environment Access
- Environment variables in .env files
- Configuration in workspace root
- Local development settings

## API Integration Protocols

### 1. Gemini AI Service
Access Pattern:
```typescript
// Access via src/lib/services/ai.ts
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
```

### 2. News Service
Access Pattern:
```typescript
// Access via src/lib/services/news.ts
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
```

## Documentation Operations

When updating documentation:
1. Use write_to_file for new files
2. Use replace_in_file for modifications
3. Maintain AI-readable formatting
4. Include complete file paths
5. Document error handling

## Code Modification Protocols

### File Operations
```typescript
// Example replace_in_file operation
<replace_in_file>
<path>src/components/Example.tsx</path>
<diff>
<<<<<<< SEARCH
// Old code
=======
// New code
>>>>>>> REPLACE
</diff>
</replace_in_file>
```

### Error Handling
```typescript
try {
  // Operation
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Operation failed:', error.message);
  }
  throw new Error('Operation failed');
}
```

## Testing Protocols

### Verification Steps
1. Parse file contents
2. Validate syntax
3. Check types
4. Verify component rendering
5. Confirm state management

### Error Cases
- Handle API failures
- Manage state conflicts
- Process type mismatches
- Handle network issues

## Security Protocols

### Data Handling
- Validate input data
- Sanitize output
- Handle sensitive information
- Respect rate limits

### Access Patterns
- Use environment variables
- Follow security policies
- Implement proper error handling

## Performance Guidelines

### React Components
```typescript
// Optimization example
const MemoizedComponent = React.memo(({ prop }) => {
  const callback = useCallback(() => {
    // Implementation
  }, [/* dependencies */]);
  
  return <div>{/* Component JSX */}</div>;
});
```

### State Management
- Implement proper hooks
- Optimize re-renders
- Handle cleanup

## Documentation Standards

When modifying docs:
1. Keep AI-readable format
2. Include complete paths
3. Document error cases
4. Update PR documentation

## Reference Architecture

### Component Structure
```typescript
import { useState, useEffect } from 'react';

export function Component() {
  const [state, setState] = useState(initial);
  
  useEffect(() => {
    // Effect implementation
  }, [/* dependencies */]);
  
  return <div>{/* JSX */}</div>;
}
```

### Documentation Map
```
docs/
├── README.md                 # Main index
├── engineering/             # Technical docs
├── architecture/           # System design
└── pull-requests/         # Change records
```

## Notes for AI Agents

1. This documentation assumes direct file system access
2. Environment variables are accessible in workspace
3. Use proper error handling in all operations
4. Maintain documentation in AI-readable format

Remember: This documentation is specifically designed for AI agent consumption and assumes workspace access capabilities.
