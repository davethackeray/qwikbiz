# File Modification Guidelines

## Tool Usage Guide

### replace_in_file
USE WHEN:
- Making targeted changes to specific lines
- The change is localized and well-defined
- You can precisely match the existing content
- The modification is less than 25% of the file

BEST PRACTICES:
1. Use exact line matches including whitespace
2. Match complete lines, never partial lines
3. Include 1-2 lines of context if needed for uniqueness
4. Multiple SEARCH/REPLACE blocks should be in file order
5. Verify the match with read_file first if unsure

Example:
```typescript
<replace_in_file>
<path>src/components/Button.tsx</path>
<diff>
<<<<<<< SEARCH
  color: 'blue',
  size: 'medium',
=======
  color: 'indigo',
  size: 'large',
>>>>>>> REPLACE
</diff>
</replace_in_file>
```

### write_to_file
USE WHEN:
- Creating new files
- The file needs complete rewriting
- More than 25% of the file is changing
- Exact line matching is difficult/unreliable
- File structure is being significantly altered

BEST PRACTICES:
1. Use for new file creation
2. Use when replace_in_file fails to match
3. Include complete file content
4. Document major rewrites in commit messages

## Code Organization Standards

### File Size Limits
1. Source Files:
   - Maximum 300 lines of code
   - Maximum 500 lines total with comments
   - Split into modules if exceeded

2. Configuration Files:
   - Maximum 200 lines
   - Use extends/imports for larger configs
   - Split by concern (e.g., separate test configs)

3. Test Files:
   - Maximum 200 lines per test file
   - Group related tests in test suites
   - Use shared test utilities

### Modularization Guidelines
1. **Single Responsibility**
   - Each file should have one primary purpose
   - Extract shared logic to utility files
   - Use composition over inheritance

2. **Smart Imports**
   - Import only what's needed
   - Use barrel files (index.ts) strategically
   - Avoid circular dependencies

3. **Code Splitting**
   - Split large components into smaller ones
   - Use lazy loading where appropriate
   - Extract complex logic into hooks/utilities

4. **Type Organization**
   - Separate type definitions into .types.ts files
   - Use interface segregation
   - Share types through barrel files

### Comments and Documentation
1. **Inline Comments**
   - Only for complex logic
   - Explain why, not what
   - Keep under 80 characters

2. **JSDoc**
   - Required for public APIs
   - Include examples for complex functions
   - Document edge cases

3. **README Files**
   - One per significant directory
   - Keep focused and concise
   - Link to related documentation
