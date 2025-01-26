"use client";

import { KPI } from "@/types/dashboard";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

export function KPICard({ label, value, trend, color }: KPI) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
        <span 
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
            ${trend > 0 ? 'bg-green-100/10 text-green-400' : 'bg-red-100/10 text-red-400'}`}
        >
          {trend > 0 ? 
            <ArrowUpIcon className="w-3 h-3 mr-1" /> : 
            <ArrowDownIcon className="w-3 h-3 mr-1" />
          }
          {Math.abs(trend)}%
        </span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
