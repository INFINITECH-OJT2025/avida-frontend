import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function LoanGraph({ monthlyPayment }) {
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "₱0.00";
    return `₱${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate principal and interest values
  const principalAmount = (monthlyPayment * 0.7).toFixed(2);
  const interestAmount = (monthlyPayment * 0.3).toFixed(2);

  // Data for Pie Chart
  const data = [
    { name: "Principal", value: Number(principalAmount) },
    { name: "Interest", value: Number(interestAmount) },
  ];

  const COLORS = ["#990e15", "#FF9800"];

  return (
    <div className="mt-6 text-center ml-64">
      <h3 className="text-lg font-semibold mr-64">Payment Breakdown</h3>

      {/* Display Results for Readability */}
      <div className="text-gray-700 mt-2 mr-64">
        <p><strong>Principal:</strong> {formatCurrency(principalAmount)}</p>
        <p><strong>Interest:</strong> {formatCurrency(interestAmount)}</p>
      </div>

      <PieChart width={350} height={350}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
