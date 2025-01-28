# Engineering Task Checklists

These checklists ensure consistent quality and process adherence across all engineering work. Use these at their respective stages to maintain high standards.

## Start of Task Checklist

```typescript
interface TaskStartChecklist {
  planning: {
    requirements: {
      documentationReviewed: boolean;     // Review all related documentation
      acceptanceCriteriaVerified: boolean; // Verify acceptance criteria
      dependenciesIdentified: boolean;     // Identify all dependencies
    };
    security: {
      securityImplicationsAssessed: boolean; // Check security impact
      dataPrivacyReviewed: boolean;         // Review data privacy concerns
      complianceVerified: boolean;          // Verify regulatory compliance
    };
    technical: {
      architectureReviewed: boolean;        // Review architectural impact
      testingStrategyDefined: boolean;      // Define testing approach
      performanceConsidered: boolean;       // Consider performance impacts
    };
  };
  setup: {
    environment: {
      branchCreated: boolean;              // Create feature branch
      localEnvironmentVerified: boolean;    // Verify local setup
      dependenciesInstalled: boolean;       // Install dependencies
    };
    documentation: {
      journalStarted: boolean;             // Start engineering journal entry
      contextDocumented: boolean;          // Document task context
      decisionsTracked: boolean;           // Track initial decisions
    };
    testing: {
      testPlanCreated: boolean;           // Create test plan
      testEnvironmentReady: boolean;      // Prepare test environment
      baselineMetricsRecorded: boolean;   // Record baseline metrics
    };
  };
}
```

## End of Task Checklist

```typescript
interface TaskEndChecklist {
  codeQuality: {
    testing: {
      unitTestsWritten: boolean;          // Write unit tests
      integrationTestsWritten: boolean;   // Write integration tests
      testsCoverage: boolean;             // Verify coverage meets standards
    };
    review: {
      selfReviewCompleted: boolean;       // Complete self-review
      linterPassing: boolean;             // Verify linter checks
      typeChecksPassing: boolean;         // Verify type checks
    };
    security: {
      securityChecksRun: boolean;         // Run security checks
      vulnerabilitiesAddressed: boolean;  // Address vulnerabilities
      secretsScanned: boolean;            // Scan for secrets
    };
  };
  documentation: {
    technical: {
      apiDocsUpdated: boolean;           // Update API documentation
      readmeUpdated: boolean;            // Update README if needed
      changelogUpdated: boolean;         // Update changelog
    };
    process: {
      journalCompleted: boolean;         // Complete journal entry
      decisionsDocumented: boolean;      // Document decisions
      metricsRecorded: boolean;         // Record final metrics
    };
    review: {
      spellingGrammarChecked: boolean;   // Check spelling/grammar
      linksVerified: boolean;           // Verify documentation links
      examplesValidated: boolean;       // Validate examples
    };
  };
  delivery: {
    verification: {
      acceptanceCriteriaMet: boolean;    // Verify acceptance criteria
      performanceValidated: boolean;     // Validate performance
      accessibilityChecked: boolean;     // Check accessibility
    };
    cleanup: {
      consoleLogsRemoved: boolean;       // Remove console logs
      debugCodeRemoved: boolean;         // Remove debug code
      todosCaptured: boolean;           // Capture remaining TODOs
    };
    readiness: {
      prTemplateCompleted: boolean;      // Complete PR template
      ciPassing: boolean;               // Verify CI passing
      deploymentTested: boolean;        // Test deployment
    };
  };
}
```

## End of Session Checklist

```typescript
interface SessionEndChecklist {
  codeManagement: {
    versionControl: {
      changesCommitted: boolean;         // Commit all changes
      branchUpdated: boolean;           // Update branch with main
      conflictsResolved: boolean;       // Resolve any conflicts
    };
    workspace: {
      testsPassLocally: boolean;        // Verify tests pass
      buildSuccessful: boolean;         // Verify build succeeds
      environmentClean: boolean;        // Clean environment if needed
    };
  };
  documentation: {
    progress: {
      journalUpdated: boolean;          // Update engineering journal
      progressDocumented: boolean;      // Document progress
      blockersCaptured: boolean;        // Document blockers
    };
    handover: {
      statusUpdated: boolean;           // Update status
      nextStepsDocumented: boolean;     // Document next steps
      contextShared: boolean;           // Share context if needed
    };
  };
  planning: {
    review: {
      progressAssessed: boolean;        // Assess progress
      estimatesAdjusted: boolean;      // Adjust estimates if needed
      risksUpdated: boolean;           // Update risk assessment
    };
    preparation: {
      tasksTriaged: boolean;           // Triage remaining tasks
      prioritiesSet: boolean;          // Set priorities for next session
      resourcesIdentified: boolean;    // Identify needed resources
    };
  };
}
```

## Usage Notes

1. **Start of Task**
   - Complete before writing any code
   - Focus on preparation and understanding
   - Document initial decisions

2. **End of Task**
   - Ensure quality before submitting PR
   - Verify all documentation is updated
   - Check all standards are met

3. **End of Session**
   - Clean up work in progress
   - Document status for next session
   - Plan next steps

## Implementation

1. **Integration**
   - Add to PR template
   - Include in CI checks
   - Link from documentation

2. **Automation**
   - Automate where possible
   - Track completion rates
   - Monitor effectiveness

3. **Maintenance**
   - Review regularly
   - Update based on feedback
   - Keep aligned with standards

## Success Metrics

1. **Quality**
   - Reduced defect rate
   - Better documentation
   - Faster reviews

2. **Efficiency**
   - Less rework
   - Faster onboarding
   - Better handovers

3. **Compliance**
   - Standards met
   - Security maintained
   - Documentation complete

Remember: These checklists are living documents. Suggest improvements based on experience.
