import { FaHome, FaEnvelope, FaUsers, FaChartLine } from "react-icons/fa";

const KPICard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
      <div className="text-3xl">{icon}</div>
      <div className="ml-4">
        <p className="text-gray-600">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default KPICard;
