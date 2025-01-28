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
        impactMap.set(depId, 0.5); // Default impact weight
      });
    });
  }

  manageDepartments(event: { type: string; departmentId: string; impact: number }) {
    const affectedDept = this.departments[event.departmentId];
    if (!affectedDept) return;

    // Update primary department
    this.updateDepartmentState(affectedDept, event.impact);

    // Calculate and apply cascading effects
    this.propagateEffects(affectedDept.id, event.impact, new Set());
  }

  private updateDepartmentState(dept: Department, impact: number) {
    // Update metrics based on impact
    const newMetrics = {
      performance: Math.max(0, Math.min(100, dept.metrics.performance + impact * 0.6)),
      efficiency: Math.max(0, Math.min(100, dept.metrics.efficiency + impact * 0.4)),
      satisfaction: Math.max(0, Math.min(100, dept.metrics.satisfaction + impact * 0.3))
    };

    this.departments[dept.id].metrics = newMetrics;
  }

  private propagateEffects(sourceId: string, originalImpact: number, visited: Set<string>) {
    visited.add(sourceId);
    const impactMap = this.impactMatrix.get(sourceId);
    
    if (!impactMap) return;

    impactMap.forEach((weight, targetId) => {
      if (visited.has(targetId)) return; // Prevent circular effects

      const cascadingImpact = originalImpact * weight;
      const targetDept = this.departments[targetId];
      
      if (targetDept) {
        this.updateDepartmentState(targetDept, cascadingImpact);
        // Recursively propagate effects with diminishing impact
        this.propagateEffects(targetId, cascadingImpact * 0.5, visited);
      }
    });
  }

  getDepartmentState(departmentId: string): Department | null {
    return this.departments[departmentId] || null;
  }

  getAllDepartments(): Department[] {
    return Object.values(this.departments);
  }
}
