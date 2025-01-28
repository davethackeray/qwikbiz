import { DepartmentNetwork } from '../../features/simulation/DepartmentNetwork';

export class DepartmentService {
  private network: DepartmentNetwork;

  constructor() {
    this.network = new DepartmentNetwork();
  }

  manageDepartments(event: Event) {
    return this.network.manageDepartments(event);
  }
}