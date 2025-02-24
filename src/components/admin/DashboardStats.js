import { Home, Calculator, Smartphone, Mail } from "lucide-react";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-6 mt-6">
  <div className="card">
    <Home size={32} className="card-icon" />
    <div>
      <h3 className="text-lg font-bold">45</h3>
      <p className="text-gray-600">Total Properties</p>
    </div>
  </div>

  <div className="card">
    <Calculator size={32} className="card-icon" />
    <div>
      <h3 className="text-lg font-bold">15</h3>
      <p className="text-gray-600">Active Loans</p>
    </div>
  </div>

  <div className="card">
    <Smartphone size={32} className="card-icon" />
    <div>
      <h3 className="text-lg font-bold">1,234</h3>
      <p className="text-gray-600">App Downloads</p>
    </div>
  </div>

  <div className="card">
    <Mail size={32} className="card-icon" />
    <div>
      <h3 className="text-lg font-bold">20</h3>
      <p className="text-gray-600">New Inquiries</p>
    </div>
  </div>
</div>

  );
}
