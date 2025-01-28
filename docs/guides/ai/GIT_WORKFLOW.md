# Git Workflow Guide

This document outlines the Git workflow for QwikBiz, integrated with our session control and documentation processes.

## Branch Strategy

```typescript
interface GitWorkflow {
  mainBranch: {
    name: 'main';
    purpose: 'Production-ready code';
    protection: 'Requires passing tests and reviews';
  };
  featureBranches: {
    format: 'feature/[feature-name]';
    purpose: 'New feature development';
    lifetime: 'Single feature cycle';
  };
  hotfixBranches: {
    format: 'hotfix/[issue-name]';
    purpose: 'Critical bug fixes';
    lifetime: 'Until fix deployed';
  };
}
```

## Commit Points

### 1. During Development
```typescript
interface DevelopmentCommits {
  timing: {
    logicalBreakpoints: 'Complete subtask or component';
    testAdditions: 'New test implementations';
    documentationUpdates: 'Significant doc changes';
  };
  requirements: {
    tests: 'All tests passing';
    linting: 'Clean lint status';
    types: 'Type checking passes';
  };
}
```

### 2. Documentation Updates
```typescript
interface DocumentationCommits {
  standalone: {
    timing: 'After significant doc changes';
    scope: 'Documentation files only';
    message: 'docs: [description]';
  };
  withCode: {
    timing: 'With related code changes';
    scope: 'Code and docs together';
    message: 'feat/fix: [description] with docs';
  };
}
```

### 3. End of Session
```typescript
interface SessionEndCommits {
  requirements: {
    docSync: 'All documentation current';
    tests: 'Full test coverage';
    build: 'Clean build status';
  };
  process: {
    finalCommit: 'Clean up and doc updates';
    push: 'To remote repository';
    prUpdate: 'Update PR if exists';
  };
}
```

## Commit Message Standards

### 1. Format
```typescript
interface CommitFormat {
  template: `
[type]([scope]): [description]

[body]

[footer]
`;
  types: [
    'feat',    // New feature
    'fix',     // Bug fix
    'docs',    // Documentation
    'test',    // Tests
    'refactor' // Code restructuring
  ];
  scope: 'Optional component/module name';
  description: 'Concise change description';
}
```

### 2. Examples
```markdown
feat(simulation): add market trend analysis

- Implements real-time market trend tracking
- Adds trend visualization component
- Updates documentation with new features

Closes #123
```

## Branch Management

### 1. Feature Development
```typescript
interface FeatureBranching {
  creation: {
    from: 'main';
    when: 'Starting new feature';
    name: 'feature/[feature-name]';
  };
  management: {
    commits: 'Regular logical chunks';
    sync: 'Daily main merge';
    docs: 'Update with code';
  };
  completion: {
    tests: 'All passing';
    docs: 'Fully updated';
    review: 'PR submitted';
  };
}
```

### 2. Main Branch Updates
```typescript
interface MainUpdates {
  requirements: {
    tests: 'Full suite passing';
    coverage: 'Meets thresholds';
    docs: 'Complete and current';
  };
  process: {
    review: 'Approved PR';
    squash: 'Clean commit history';
    delete: 'Remove feature branch';
  };
}
```

## Session Integration

### 1. Session Start
```typescript
interface SessionGitStart {
  steps: {
    sync: 'Pull latest main';
    branch: 'Create/checkout feature branch';
    verify: 'Check build and tests';
  };
  validation: {
    status: 'Clean working directory';
    branch: 'Correct branch active';
    build: 'Successful build';
  };
}
```

### 2. During Session
```typescript
interface SessionGitWork {
  frequency: {
    commits: 'At logical completion points';
    sync: 'Regular main merges';
    docs: 'With relevant changes';
  };
  validation: {
    preCommit: 'Tests and lint';
    postCommit: 'Build verification';
    preDocs: 'Accuracy check';
  };
}
```

### 3. Session End
```typescript
interface SessionGitEnd {
  requirements: {
    commits: 'All work committed';
    push: 'Everything pushed';
    docs: 'Documentation synced';
  };
  branch: {
    clean: 'No uncommitted changes';
    sync: 'Up to date with main';
    status: 'PR updated if exists';
  };
  verification: {
    build: 'Successful build';
    tests: 'All tests passing';
    docs: 'Documentation current';
  };
}
```

## Documentation Integration

### 1. Code Changes
- Commit documentation updates with related code
- Use clear commit messages linking docs to code
- Verify documentation accuracy before commit

### 2. Standalone Updates
- Separate commits for pure documentation changes
- Clear documentation-focused commit messages
- Regular documentation synchronization

### 3. Journal Updates
- Commit journal entries at session end
- Include all relevant references
- Link to related code changes

## Success Criteria

### 1. Commit Quality
- Clear, descriptive messages
- Logical change grouping
- Documentation sync
- Passing tests

### 2. Branch Health
- Regular main syncs
- Clean commit history
- Complete documentation
- Current with standards

### 3. Repository State
- Clean working directory
- Updated documentation
- Passing CI/CD
- Clear project history

Remember: Every commit should maintain or improve the project's perfect state.
