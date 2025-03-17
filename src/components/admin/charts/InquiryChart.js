import { useEffect, useState } from "react";
import { fetchInquiryTrends } from "../../../utils/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InquiryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchInquiryTrends().then((res) => {
      const formattedData = res.map(item => ({
        month: new Date(2023, item.month - 1).toLocaleString('default', { month: 'short' }),
        count: item.count
      }));
      setData(formattedData);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold">Inquiry Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Bar dataKey="count" fill="#990e15" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}