# AI Senior Engineer Session Control Guide

This document outlines the critical prompts and procedures for managing AI senior engineer sessions to ensure perfect consistency and optimal project state.

## Session Control Prompts

### 1. Session Start
```typescript
interface SessionStartPrompt {
  template: `
<task>
As the AI senior engineer for QwikBiz, review the following:
1. Current state of the project and documentation
2. Recent engineering journal entries
3. Pending tasks and priorities
4. Overall project health

Then outline your recommended focus areas for this session.
</task>
`;
  purpose: 'Initialize session with full context';
  timing: 'At the start of each session';
}
```

### 2. Task Assignment
```typescript
interface TaskPrompt {
  template: `
<task>
Implement the following feature/improvement:
[Feature description]

Requirements:
1. [Specific requirements]
2. Current project standards adherence
3. Full documentation updates
4. Comprehensive testing

Follow the task checklist and provide regular status updates.
</task>
`;
  purpose: 'Assign specific development work';
  timing: 'When starting new task';
}
```

### 3. Session End Signal
```typescript
interface SessionEndPrompt {
  template: `
<end_session>
Prepare for session end:
1. Current task state
2. Documentation status
3. System health check
4. Handover preparation

Ensure all documentation and code are in optimal state for the next session.
</end_session>
`;
  purpose: 'Trigger session cleanup and handover';
  timing: 'Before ending AI engineer session';
}
```

## End-of-Session Procedures

### 1. Code State Verification
```typescript
interface CodeStateCheck {
  compilation: {
    clean: boolean;     // No compilation errors
    warnings: number;   // Zero warnings
    linting: boolean;   // Passing all lint rules
  };
  tests: {
    passing: boolean;   // All tests passing
    coverage: number;   // Meeting coverage requirements
    types: boolean;     // Type checking passing
  };
  documentation: {
    inline: boolean;    // Code documentation complete
    types: boolean;     // Type definitions updated
    apis: boolean;      // API documentation current
  };
}
```

### 2. Documentation Update Requirements
```typescript
interface DocumentationCheck {
  engineering: {
    journal: 'Update with session work';
    decisions: 'Document technical decisions';
    changes: 'Record system changes';
  };
  technical: {
    apis: 'Update API documentation';
    architecture: 'Update design docs';
    guides: 'Update developer guides';
  };
  process: {
    tasks: 'Update task status';
    roadmap: 'Update project roadmap';
    metrics: 'Update performance metrics';
  };
}
```

### 3. Handover State
```typescript
interface HandoverState {
  codebase: {
    clean: 'No uncommitted changes';
    tested: 'All tests passing';
    documented: 'Documentation current';
  };
  tasks: {
    status: 'Clear task state';
    blockers: 'Known issues documented';
    next: 'Next steps defined';
  };
  quality: {
    metrics: 'Performance baselines';
    coverage: 'Test coverage state';
    issues: 'Known technical debt';
  };
}
```

## Critical Session Keywords

### 1. Mode Control
- `PLAN MODE`: Enter planning and analysis phase
- `ACT MODE`: Enter implementation phase
- `<end_session>`: Signal session completion

### 2. Task Control
- `<task>`: New task assignment
- `<thinking>`: Analysis and planning
- `<attempt_completion>`: Task completion

### 3. State Control
- `<verify_state>`: System state verification
- `<update_docs>`: Documentation update trigger
- `<prepare_handover>`: Session end preparation

## Session Workflow

### 1. Start of Session
1. Review project state
2. Check engineering journal
3. Verify documentation
4. Plan session goals

### 2. During Session
1. Follow task checklists
2. Maintain documentation
3. Update engineering journal
4. Track decisions

### 3. End of Session
1. Complete current task
2. Update all documentation
3. Verify system state
4. Prepare handover notes

## Documentation Requirements

### 1. Session Documentation
- Complete work log
- Technical decisions
- Status updates
- Next steps

### 2. Code Documentation
- Inline comments
- Type definitions
- API documentation
- Architecture updates

### 3. Process Documentation
- Task status
- Test results
- Performance metrics
- Known issues

## Handover Excellence

### 1. Code Quality
- Clean compilation
- All tests passing
- No lint errors
- Type safety verified

### 2. Documentation Quality
- All guides current
- Journal updated
- Decisions documented
- Next steps clear

### 3. System State
- No uncommitted work
- No pending changes
- All builds passing
- Documentation synced

## Success Criteria

### 1. Code State
- Zero compilation errors
- All tests passing
- Full type coverage
- Clean lint status

### 2. Documentation State
- Complete accuracy
- Perfect synchronization
- Clear next steps
- Full coverage

### 3. Process State
- Clear task status
- Known issues logged
- Priorities defined
- Metrics updated

Remember: Perfect consistency and optimal state are mandatory for successful session completion and project excellence.
