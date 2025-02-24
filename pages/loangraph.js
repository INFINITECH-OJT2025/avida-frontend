import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function LoanGraph({ monthlyPayment }) {
  // Calculate principal and interest values
  const principalAmount = (monthlyPayment * 0.7).toFixed(2);
  const interestAmount = (monthlyPayment * 0.3).toFixed(2);

  // Data for Pie Chart
  const data = [
    { name: "Principal", value: Number(principalAmount) },
    { name: "Interest", value: Number(interestAmount) },
  ];

  // Colors for the chart
  const COLORS = ["#990e15", "#FF9800"];

  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold">📊 Payment Breakdown</h3>

      {/* Display Results for Readability */}
      <div className="text-gray-700 mt-2">
        <p><strong>Principal:</strong> ₱{principalAmount}</p>
        <p><strong>Interest:</strong> ₱{interestAmount}</p>
      </div>

      {/* Pie Chart with Labels Inside */}
      <PieChart width={320} height={320}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // ✅ Add labels inside chart
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
