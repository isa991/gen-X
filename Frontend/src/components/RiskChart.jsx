"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function RiskChart({ highRisk, moderateRisk, lowRisk }) {
  const data = [
    {
      name: "Alto Risco",
      value: highRisk,
    },
    {
      name: "Risco Moderado",
      value: moderateRisk,
    },
    {
      name: "Baixo Risco",
      value: lowRisk,
    },
  ];

  const COLORS = ["#dc2626", "#d97706", "#16a34a"];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={110} label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
