# AI Agent Guide v2.0

## Introduction
This guide serves as the primary reference for AI agents working on the QwikBiz project. It provides structured workflows, best practices, and machine-readable interfaces for efficient development.

## Core Development Protocol

```typescript
interface DevelopmentFlow {
  planning: {
    analysis: {
      codebaseExploration: boolean;
      documentationReview: boolean;
      requirementValidation: boolean;
    };
    design: {
      architecturalConsiderations: string[];
      securityImplications: string[];
      performanceTargets: Record<string, number>;
    };
    validation: {
      feasibilityCheck: boolean;
      riskAssessment: string[];
      resourceRequirements: string[];
    };
  };
  implementation: {
    coding: {
      followStandards: boolean;
      typeChecking: boolean;
      errorHandling: boolean;
      documentation: boolean;
    };
    testing: {
      unitTests: boolean;
      integrationTests: boolean;
      securityTests: boolean;
      performanceTests: boolean;
    };
    review: {
      codeSelfReview: boolean;
      documentationUpdate: boolean;
      securityValidation: boolean;
    };
  };
  delivery: {
    verification: {
      allTestsPassing: boolean;
      lintersPassing: boolean;
      typesValid: boolean;
    };
    documentation: {
      updated: boolean;
      machineReadable: boolean;
      examples: boolean;
    };
    handover: {
      prDescription: boolean;
      testEvidence: boolean;
      securityChecks: boolean;
    };
  };
}
```

## Show & Tell Protocol

```typescript
interface ShowAndTell {
  preparation: {
    demo: {
      feature: string;
      workingExample: string;
      testCases: string[];
      userFlows: string[];
    };
    documentation: {
      technicalOverview: string;
      userInstructions: string;
      troubleshooting: string[];
    };
    validation: {
      performanceMetrics: Record<string, number>;
      securityChecks: string[];
      accessibilityTests: string[];
    };
  };
  execution: {
    steps: {
      introduction: string;
      demonstration: string;
      userInteraction: string;
      feedbackCollection: string;
    };
    contingency: {
      fallbackScenarios: string[];
      recoverySteps: string[];
      supportDocs: string[];
    };
  };
  followup: {
    documentation: {
      userFeedback: string[];
      improvements: string[];
      bugReports: string[];
    };
    actions: {
      tasks: string[];
      priorities: string[];
      assignments: string[];
    };
  };
}
```

## Development Best Practices

### Code Organization
```typescript
interface CodeStandards {
  structure: {
    atomic: boolean;     // Use atomic design for components
    featureBased: boolean; // Feature-based directory structure
    typeSafe: boolean;   // Strong TypeScript typing
  };
  patterns: {
    hooks: boolean;      // Custom React hooks for logic
    context: boolean;    // React Context for state
    hoc: boolean;        // Higher-order components
  };
  quality: {
    linting: boolean;    // ESLint compliance
    formatting: boolean; // Prettier formatting
    testing: boolean;    // Jest test coverage
  };
}
```

### Documentation Standards
```typescript
interface DocumentationRequirements {
  code: {
    interfaces: boolean;    // TypeScript interfaces
    jsdoc: boolean;        // JSDoc comments
    examples: boolean;      // Usage examples
  };
  architecture: {
    diagrams: boolean;     // System diagrams
    flowcharts: boolean;   // Process flows
    decisions: boolean;    // Architecture decisions
  };
  operations: {
    setup: boolean;        // Setup instructions
    deployment: boolean;   // Deployment guides
    monitoring: boolean;   // Monitoring docs
  };
}
```

## Engineering Journal Protocol
Maintain detailed records in `docs/engineering/JOURNAL.md`:
- Daily progress
- Technical decisions
- Learning insights
- Next steps

### Journal Entry Format
```typescript
interface JournalEntry {
  date: string;
  author: string;
  category: 'feature' | 'bugfix' | 'refactor' | 'docs';
  details: {
    completed: string[];
    decisions: string[];
    challenges: string[];
    nextSteps: string[];
  };
  metrics?: {
    performance?: Record<string, number>;
    coverage?: Record<string, number>;
    complexity?: Record<string, number>;
  };
}
```

## Testing Protocol
```typescript
interface TestingRequirements {
  unit: {
    coverage: number;      // Minimum 90%
    isolation: boolean;    // Pure unit tests
    mocking: boolean;      // Proper test doubles
  };
  integration: {
    coverage: number;     // Minimum 85%
    e2e: boolean;        // End-to-end flows
    performance: boolean; // Performance checks
  };
  security: {
    penTests: boolean;   // Penetration tests
    scanning: boolean;   // Security scanning
    compliance: boolean; // Compliance checks
  };
}
```

## Error Resolution Workflow
Follow the Error Resolution Protocol in `.clinerules`:
1. Triage with multiple hypotheses
2. Simulate different approaches
3. Present analysis
4. Implement solution

## Security Guidelines
Follow Zero-Trust principles:
- Validate all inputs
- Secure all endpoints
- Encrypt sensitive data
- Audit all actions

## Performance Standards
```typescript
interface PerformanceTargets {
  pageLoad: {
    initial: number;    // Maximum 2s
    subsequent: number; // Maximum 1s
  };
  interactions: {
    response: number;   // Maximum 100ms
    animation: number;  // 60fps minimum
  };
  api: {
    response: number;   // Maximum 200ms
    timeout: number;    // 5s maximum
  };
}
```

## Communication Protocol
- Use TypeScript interfaces for clarity
- Provide machine-readable documentation
- Follow conventional commit messages
- Update engineering journal regularly

## Project Mechanics
- Feature branch workflow
- PR reviews with security focus
- Automated testing pipeline
- Regular show & tell sessions

## Handover Process
1. Update documentation
2. Verify all tests pass
3. Complete engineering journal
4. Document next steps
5. Tag relevant team members

Remember: All changes must be documented, tested, and secure by default.
