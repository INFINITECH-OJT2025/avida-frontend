import { useEffect, useState } from "react";
import { fetchPropertyTrends } from "../../../../src/utils/api"; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PropertyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPropertyTrends().then((res) => {
      // Format data to display months properly
      const formattedData = res.map(item => ({
        month: new Date(2023, item.month - 1).toLocaleString('default', { month: 'short' }),
        count: item.count
      }));
      setData(formattedData);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold">Property Listings Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#990e15" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
