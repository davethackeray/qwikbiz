# Senior Engineer Onboarding Guide

## Quick Start

```typescript
interface OnboardingPath {
  day1: {
    codebase: 'architecture-overview';
    documentation: 'AI_AGENT_GUIDE.md';
    setup: 'development-environment';
  };
  week1: {
    features: 'core-simulation';
    processes: 'engineering-workflows';
    contribution: 'first-tasks';
  };
}
```

## 1. Documentation Reading Order

1. **Core Understanding** (Day 1)
   - `/docs/AI_AGENT_GUIDE.md` - Primary index and system overview
   - `/docs/architecture/ARCHITECTURE.md` - System design and structure
   - `/docs/engineering/ENGINEERING_RULES.md` - Development standards

2. **Process & Workflow** (Day 1-2)
   - `/docs/engineering/TESTING_STRATEGY.md` - Testing requirements
   - `/docs/engineering/CHANGE_PROCESS.md` - Change management
   - `/docs/engineering/FEATURE_PROPOSAL_TEMPLATE.md` - Enhancement proposals

3. **Feature Understanding** (Day 2-3)
   - `/docs/pull-requests/README.md` - Active features and priorities
   - `/docs/ROADMAP.md` - Project direction
   - `/docs/icebox/README.md` - Deferred features

## 2. Codebase Organization

### Component Structure
```typescript
interface CodebaseStructure {
  components: {
    atoms: '/src/components/atoms/*';     // Base components
    molecules: '/src/components/molecules/*'; // Composite components
    organisms: '/src/components/organisms/*'; // Complex components
    templates: '/src/components/templates/*'; // Page templates
  };
  core: {
    services: '/src/lib/services/*';      // Business logic
    hooks: '/src/hooks/*';               // React hooks
    types: '/src/types/*';               // TypeScript definitions
  };
  features: {
    simulation: '/src/features/simulation/*'; // Core simulation
    analytics: '/src/features/analytics/*';   // Analytics system
    insights: '/src/features/insights/*';     // AI insights
  };
}
```

### Key Areas

1. **Simulation Engine**
   - Business logic implementation
   - Market dynamics
   - Cross-departmental effects

2. **User Interface**
   - Atomic design structure
   - Component hierarchy
   - Styled components

3. **State Management**
   - React hooks
   - Context providers
   - Data flow

## 3. Development Workflow

### Feature Development
1. Review `/docs/pull-requests/README.md`
2. Check prioritization in current sprint
3. Follow feature proposal template
4. Create implementation plan
5. Get architecture review
6. Implement with tests
7. Submit for review

### Code Quality
1. TypeScript for type safety
2. Jest for testing
3. ESLint for static analysis
4. Prettier for formatting
5. Husky for pre-commit hooks

### Testing Requirements
```typescript
interface TestingRequirements {
  unit: {
    coverage: number;      // Minimum 90%
    patterns: string[];
    critical: string[];
  };
  integration: {
    coverage: number;     // Minimum 85%
    scenarios: string[];
    e2e: string[];
  };
}
```

## 4. Common Questions

### Architecture
Q: How do components communicate?
A: Through services and hooks, following a unidirectional data flow.

Q: Where is business logic implemented?
A: In `/src/lib/services/` with clear separation from UI.

Q: How are features organized?
A: Using atomic design pattern with clear separation of concerns.

### Development
Q: How do I propose new features?
A: Use `/docs/engineering/FEATURE_PROPOSAL_TEMPLATE.md` and submit PR.

Q: What's the testing strategy?
A: See `/docs/engineering/TESTING_STRATEGY.md` for requirements.

Q: How are changes reviewed?
A: Follow process in `/docs/engineering/CHANGE_PROCESS.md`.

### Project
Q: What's the current focus?
A: Core simulation enhancements (PR-012) and Special Projects Suite (PR-011).

Q: Where are future plans documented?
A: See `/docs/ROADMAP.md` and pull request index.

Q: How are features prioritized?
A: Using scoring system in PR index with clear criteria.

## 5. First Week Goals

### Day 1
- [ ] Review core documentation
- [ ] Set up development environment
- [ ] Run application locally
- [ ] Review current sprint board

### Days 2-3
- [ ] Review active pull requests
- [ ] Understand core simulation logic
- [ ] Review testing infrastructure
- [ ] Set up debugging environment

### Days 4-5
- [ ] Review feature proposals
- [ ] Understand deployment process
- [ ] Review monitoring setup
- [ ] Plan first contribution

## 6. Key Contacts

```typescript
interface TeamContacts {
  technical: {
    architect: string;
    lead: string;
    devops: string;
  };
  product: {
    owner: string;
    manager: string;
  };
  qa: {
    lead: string;
    automation: string;
  };
}
```

## 7. Tools & Resources

### Development Environment
- VS Code with recommended extensions
- Node.js and npm
- Docker for local services
- Git with commit hooks

### Documentation
- TypeScript interfaces
- React component docs
- API specifications
- Architecture diagrams

### Monitoring
- Performance metrics
- Error tracking
- Usage analytics
- System health

## 8. Success Metrics

As a senior engineer, you should be able to:

1. Day 1
   - [ ] Understand system architecture
   - [ ] Navigate codebase confidently
   - [ ] Run application locally

2. Week 1
   - [ ] Contribute to code reviews
   - [ ] Implement minor changes
   - [ ] Understand deployment process

3. Month 1
   - [ ] Lead feature development
   - [ ] Contribute to architecture
   - [ ] Mentor team members

## 9. Next Steps

1. Review active projects in PR index
2. Schedule architecture review session
3. Plan first feature contribution
4. Set up recurring code reviews
5. Join technical planning sessions

Remember: The AI_AGENT_GUIDE.md is your primary reference. All documentation is machine-readable and follows our standardized format for easy consumption.
