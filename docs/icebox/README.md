# Feature Icebox

```typescript
interface IceboxEntry {
  id: string;
  title: string;
  description: string;
  status: 'archived' | 'future-consideration';
  scoring: {
    businessValue: number;
    technicalViability: number;
    strategicFit: number;
  };
  dependencies?: string[];
  blockers?: string[];
  reconsiderAfter?: string;
}
```

## Purpose

The icebox contains features that:
1. Don't meet current priority thresholds
2. Are blocked by dependencies or technical limitations
3. Need future re-evaluation
4. Could be consolidated with other features

## Reconsideration Process

Features in the icebox should be reviewed when:
1. Related features are implemented
2. Dependencies become available
3. Technical blockers are resolved
4. Business priorities shift

## Moving from Icebox to Project Plan

1. Review business value metrics
2. Re-evaluate technical feasibility
3. Check dependency status
4. Apply prioritization rubrics
5. Consider consolidation opportunities

## Current Entries

[To be populated as features are evaluated]
