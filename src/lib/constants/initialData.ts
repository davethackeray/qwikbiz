import { KPI, Department } from "@/types/dashboard";

export const INITIAL_KPIS: KPI[] = [
  {
    label: "Annual Revenue",
    value: "$245M",
    trend: 12.5,
    color: "text-green-400",
  },
  {
    label: "Revenue Growth",
    value: "12.5%",
    trend: 2.1,
    color: "text-blue-400",
  },
  {
    label: "Gross Profit Margin",
    value: "32%",
    trend: -1.2,
    color: "text-yellow-400",
  },
  {
    label: "Cash Flow",
    value: "-$28M",
    trend: -5.3,
    color: "text-red-400",
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    name: "Human Resources",
    metrics: {
      efficiency: 75,
      morale: 82,
      innovation: 65,
    },
  },
  {
    name: "Finance",
    metrics: {
      efficiency: 88,
      morale: 71,
      innovation: 59,
    },
  },
  {
    name: "Operations",
    metrics: {
      efficiency: 92,
      morale: 68,
      innovation: 73,
    },
  },
  {
    name: "Senior Leadership",
    metrics: {
      efficiency: 85,
      morale: 79,
      innovation: 81,
    },
  },
];
