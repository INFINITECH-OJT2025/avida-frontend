import { useEffect, useState } from "react";
import { fetchWebsiteTraffic } from "../../../../src/utils/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#990e15", "#ff6666", "#ff9999", "#cccccc", "#ffcc00"];

export default function WebsiteTrafficChart() {
  const [trafficData, setTrafficData] = useState([]);

  useEffect(() => {
    async function getTrafficData() {
      try {
        const response = await fetchWebsiteTraffic();
        console.log("Website Traffic Data:", response);

        if (response.sources) {
          setTrafficData(response.sources);
        }
      } catch (error) {
        console.error("Error fetching website traffic:", error);
      }
    }

    getTrafficData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-bold">Website Traffic Sources</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={trafficData}
            dataKey="visits"
            nameKey="source"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {trafficData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
