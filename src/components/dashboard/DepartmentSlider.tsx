"use client";

import { Department } from "@/types/dashboard";

export function DepartmentSlider({ name, metrics }: Department) {
  const getMetricColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{name}</h3>
      <div className="space-y-4">
        {Object.entries(metrics).map(([metric, value]) => (
          <div key={metric} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm text-gray-400 capitalize">
                {metric}
              </label>
              <span className="text-sm text-gray-400">{value}%</span>
            </div>
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute h-full rounded-full transition-all duration-500 ${getMetricColor(value)}`}
                style={{
                  width: `${value}%`,
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
