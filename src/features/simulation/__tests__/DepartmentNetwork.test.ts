import { DepartmentNetwork } from '../DepartmentNetwork';

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

describe('DepartmentNetwork', () => {
  let network: DepartmentNetwork;
  let departments: Department[];

  beforeEach(() => {
    departments = [
      {
        id: 'sales',
        name: 'Sales',
        metrics: {
          performance: 80,
          efficiency: 75,
          satisfaction: 85
        },
        dependencies: ['marketing', 'operations']
      },
      {
        id: 'marketing',
        name: 'Marketing',
        metrics: {
          performance: 85,
          efficiency: 80,
          satisfaction: 75
        },
        dependencies: ['sales']
      },
      {
        id: 'operations',
        name: 'Operations',
        metrics: {
          performance: 90,
          efficiency: 85,
          satisfaction: 80
        },
        dependencies: ['sales']
      }
    ];
    
    network = new DepartmentNetwork(departments);
  });

  describe('Department State Management', () => {
    it('should initialize departments with correct state', () => {
      departments.forEach(dept => {
        const state = network.getDepartmentState(dept.id);
        expect(state).toBeDefined();
        expect(state?.metrics).toEqual(dept.metrics);
      });
    });

    it('should update department metrics based on events', () => {
      const event = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      network.manageDepartments(event);
      const state = network.getDepartmentState('sales');
      
      expect(state?.metrics.performance).toBeGreaterThan(80);
      expect(state?.metrics.efficiency).toBeGreaterThan(75);
      expect(state?.metrics.satisfaction).toBeGreaterThan(85);
    });

    it('should maintain metrics within valid range (0-100)', () => {
      const event = {
        type: 'market_change',
        departmentId: 'operations',
        impact: 2.0, // Large positive impact
        timestamp: Date.now()
      };

      network.manageDepartments(event);
      const state = network.getDepartmentState('operations');
      
      expect(state?.metrics.performance).toBeLessThanOrEqual(100);
      expect(state?.metrics.efficiency).toBeLessThanOrEqual(100);
      expect(state?.metrics.satisfaction).toBeLessThanOrEqual(100);
    });
  });

  describe('Cross-Department Effects', () => {
    it('should propagate effects to dependent departments', () => {
      const event = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      const initialMarketingState = network.getDepartmentState('marketing');
      network.manageDepartments(event);
      const updatedMarketingState = network.getDepartmentState('marketing');

      expect(updatedMarketingState?.metrics.performance)
        .not.toBe(initialMarketingState?.metrics.performance);
    });

    it('should handle circular dependencies gracefully', () => {
      const event = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      // This should not cause infinite recursion
      expect(() => network.manageDepartments(event)).not.toThrow();
    });

    it('should apply diminishing effects to distant dependencies', () => {
      const event = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 1.0,
        timestamp: Date.now()
      };

      network.manageDepartments(event);

      const salesState = network.getDepartmentState('sales');
      const marketingState = network.getDepartmentState('marketing');
      const operationsState = network.getDepartmentState('operations');

      // Direct impact should be strongest
      const salesImpact = salesState!.metrics.performance - 80;
      const marketingImpact = marketingState!.metrics.performance - 85;
      const operationsImpact = operationsState!.metrics.performance - 90;

      expect(Math.abs(salesImpact)).toBeGreaterThan(Math.abs(marketingImpact));
      expect(Math.abs(marketingImpact)).toBeGreaterThan(Math.abs(operationsImpact));
    });
  });

  describe('Performance', () => {
    it('should process events within performance target', () => {
      const events = Array.from({ length: 100 }, (_, i) => ({
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.1,
        timestamp: Date.now() + i
      }));

      const start = Date.now();
      
      events.forEach(event => {
        network.manageDepartments(event);
      });
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThanOrEqual(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid department IDs gracefully', () => {
      const event = {
        type: 'market_change',
        departmentId: 'invalid_dept',
        impact: 0.5,
        timestamp: Date.now()
      };

      expect(() => network.manageDepartments(event)).not.toThrow();
    });

    it('should handle null metrics gracefully', () => {
      const state = network.getDepartmentState('nonexistent');
      expect(state).toBeNull();
    });
  });
});
