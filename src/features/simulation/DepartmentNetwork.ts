interface Department {
  id: string;
  name: string;
  metrics: {
    performance: number;
    efficiency: number;
    satisfaction: number;
  };
  dependencies: string[];
}

interface DepartmentState {
  [key: string]: Department;
}

export class DepartmentNetwork {
  private departments: DepartmentState;
  private impactMatrix: Map<string, Map<string, number>>;
  private readonly maxDiminishingDepth = 3;

  constructor(initialDepartments: Department[]) {
    this.departments = {};
    this.impactMatrix = new Map();
    
    // Initialize departments
    initialDepartments.forEach(dept => {
      this.departments[dept.id] = dept;
      this.impactMatrix.set(dept.id, new Map());
    });

    // Build impact matrix for cross-department effects
    initialDepartments.forEach(dept => {
      const impactMap = this.impactMatrix.get(dept.id)!;
      dept.dependencies.forEach(depId => {
        // Calculate initial impact weight based on dependency relationship
        const weight = this.calculateInitialWeight(dept.id, depId);
        impactMap.set(depId, weight);
      });
    });
  }

  private calculateInitialWeight(sourceId: string, targetId: string): number {
    // Calculate weight based on reciprocal dependencies and position in chain
    const targetDept = this.departments[targetId];
    const hasReciprocal = targetDept && targetDept.dependencies.includes(sourceId);
    const baseWeight = hasReciprocal ? 0.8 : 0.6;
    
    // Add some randomization to create more realistic variations
    const variation = 0.1 * (Math.random() - 0.5); // +/- 0.05
    return Math.min(1, Math.max(0.3, baseWeight + variation));
  }

  manageDepartments(event: { type: string; departmentId: string; impact: number }) {
    const affectedDept = this.departments[event.departmentId];
    if (!affectedDept) return;

    // Update primary department with full impact
    this.updateDepartmentState(affectedDept, event.impact);

    // Calculate and apply cascading effects
    const visited = new Set<string>();
    this.propagateEffects(affectedDept.id, event.impact, visited, 0);
  }

  private updateDepartmentState(dept: Department, impact: number) {
    // Update metrics based on impact with weighted distribution
    const newMetrics = {
      performance: Math.max(0, Math.min(100, dept.metrics.performance + impact * 0.6)),
      efficiency: Math.max(0, Math.min(100, dept.metrics.efficiency + impact * 0.4)),
      satisfaction: Math.max(0, Math.min(100, dept.metrics.satisfaction + impact * 0.3))
    };

    this.departments[dept.id].metrics = newMetrics;
  }

  private propagateEffects(sourceId: string, originalImpact: number, visited: Set<string>, depth: number) {
    if (depth >= this.maxDiminishingDepth) return;
    visited.add(sourceId);
    
    const impactMap = this.impactMatrix.get(sourceId);
    if (!impactMap) return;

    impactMap.forEach((weight, targetId) => {
      const targetDept = this.departments[targetId];
      if (!targetDept) return;

      // Calculate diminishing factor based on network depth
      const diminishingFactor = Math.pow(0.7, depth);
      const baseImpact = originalImpact * weight * diminishingFactor;

      if (visited.has(targetId)) {
        // Handle circular dependencies with reduced impact
        const circularImpact = baseImpact * 0.4;
        this.updateDepartmentState(targetDept, circularImpact);
        return;
      }

      // Apply calculated impact
      this.updateDepartmentState(targetDept, baseImpact);

      // Recursively propagate effects with increased depth
      const depthIncrease = targetDept.dependencies.length > 1 ? 1.5 : 1;
      this.propagateEffects(targetId, baseImpact, new Set(visited), depth + depthIncrease);
    });
  }

  getDepartmentState(departmentId: string): Department | null {
    return this.departments[departmentId] || null;
  }

  getAllDepartments(): Department[] {
    return Object.values(this.departments);
  }
}
