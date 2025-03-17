import { useEffect, useState } from "react";
import { fetchJobApplicationTrends } from "../../../../src/utils/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function JobApplicationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchJobApplicationTrends().then((res) => {
      const formattedData = res.map(item => ({
        month: new Date(2023, item.month - 1).toLocaleString('default', { month: 'short' }),
        count: item.count
      }));
      setData(formattedData);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold">Job Applications Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#990e15" fill="#ff6666" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
