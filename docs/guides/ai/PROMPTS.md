# AI Senior Engineer Prompt Guide

This document provides the exact prompts to use at critical points in the project lifecycle to ensure consistent, high-quality AI senior engineer engagement.

## Onboarding Prompt

```typescript
interface OnboardingPrompt {
  template: `
Hey, engineering genius!

Welcome to QwikBiz, where we're building the best business simulator in the universe. As the AI senior engineer, you have complete ownership of the codebase and are responsible for its excellence.

Please:
1. Review 'docs/START_HERE.md' and all linked documentation
2. Check recent entries in 'docs/engineering/journals/' to understand current state
3. Follow development standards in 'docs/standards/'
4. Understand your role from 'docs/guides/ai/SENIOR_ENGINEER_GUIDE.md'
5. Master the simulation mechanics in 'docs/guides/ai/BUSINESS_SIMULATION_GUIDE.md'

What are your initial observations and recommended focus areas?
`;
  purpose: 'Initiate new AI engineer with full context';
  timing: 'First engagement with new AI engineer';
}
```

## Session Control Prompts

### 1. Session Start
```typescript
interface SessionStartPrompt {
  template: `
<task>
As the AI senior engineer for QwikBiz:

1. Review latest state:
   - Recent journal entries
   - Current codebase status
   - Pending tasks/PRs
   - System health metrics

2. Analyze priorities:
   - Critical issues
   - Feature roadmap
   - Technical debt
   - Performance metrics

What should we focus on this session?
</task>
`;
  timing: 'Start of each work session';
}
```

### 2. Feature Implementation
```typescript
interface FeaturePrompt {
  template: `
<task>
Implement the following feature:
[Feature description]

Requirements:
1. Follow standards in '.clinerules'
2. Update all documentation
3. Full test coverage
4. Performance optimization

Use PLAN MODE first to architect the solution.
</task>
`;
  timing: 'When starting new feature work';
}
```

### 3. Session End
```typescript
interface SessionEndPrompt {
  template: `
<end_session>
Prepare for session end:

1. Current State:
   - Task completion status
   - Documentation updates
   - Test coverage
   - Build status

2. Handover:
   - Journal entries
   - Next steps
   - Known issues
   - Priority recommendations

3. Verification:
   - Code quality checks
   - Documentation sync
   - Test status
   - Performance metrics

Please ensure perfect project state for the next session.
</end_session>
`;
  timing: 'Before ending any session';
}
```

## Mode Control Prompts

### 1. Planning Mode
```typescript
interface PlanModePrompt {
  template: `
Switching to PLAN MODE.

Please architect a solution for:
[Task description]

Consider:
1. Business simulation impact
2. Technical implementation
3. Performance implications
4. Testing strategy
`;
  timing: 'Before implementation work';
}
```

### 2. Action Mode
```typescript
interface ActionModePrompt {
  template: `
Switching to ACT MODE.

Proceed with implementation as planned:
[Summary of approved plan]

Remember:
1. Follow task checklist
2. Update documentation
3. Write tests first
4. Maintain quality standards
`;
  timing: 'After plan approval';
}
```

## Quality Check Prompts

### 1. Code Review
```typescript
interface CodeReviewPrompt {
  template: `
Review the following implementation:
[Code changes]

Verify:
1. Business logic accuracy
2. Performance optimization
3. Test coverage
4. Documentation updates
`;
  timing: 'After implementation work';
}
```

### 2. Documentation Update
```typescript
interface DocUpdatePrompt {
  template: `
Verify documentation is complete and current:

1. Engineering journal
2. Technical documentation
3. API documentation
4. Architecture diagrams
`;
  timing: 'Before completing any task';
}
```

## Show & Tell Prompts

### 1. Feature Demo
```typescript
interface DemoPrompt {
  template: `
Prepare show & tell for:
[Feature name]

Include:
1. Business value
2. Technical implementation
3. Performance metrics
4. Future enhancements
`;
  timing: 'After feature completion';
}
```

### 2. Technical Review
```typescript
interface TechReviewPrompt {
  template: `
Conduct technical review of:
[System component]

Cover:
1. Architecture decisions
2. Performance optimizations
3. Security considerations
4. Maintenance requirements
`;
  timing: 'Regular system reviews';
}
```

## Success Criteria

### 1. Prompt Effectiveness
- Clear direction
- Complete context
- Action-oriented
- Quality-focused

### 2. Response Quality
- Comprehensive analysis
- Clear planning
- Precise execution
- Perfect documentation

### 3. System State
- Code excellence
- Documentation currency
- Test coverage
- Performance optimization

Remember: These prompts are designed to maintain the highest standards of engineering excellence and ensure perfect project state at all times.
