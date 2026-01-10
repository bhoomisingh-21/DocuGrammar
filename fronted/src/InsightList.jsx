import React from "react";
import { CheckCircle } from "lucide-react";

/**
 * Renders a list of insights or suggestions.
 * Can be used independently.
 */
export default function InsightList({ data = [] }) {
  if (!data.length) {
    return <p className="text-gray-400">No insights available</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 bg-[#020617] p-3 rounded-lg border border-white/10"
        >
          <CheckCircle className="text-green-400 mt-1" size={18} />
          <span className="text-gray-200">{item}</span>
        </li>
      ))}
    </ul>
  );
}
