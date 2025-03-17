import { useEffect, useState } from "react";
import JobApplicationsTable from "../../src/components/admin/job/JobApplicationsTable";
import AdminLayout from "../../src/components/layout/AdminLayout";
const JobApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/job-applications")
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load applications");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading applications...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <AdminLayout>
    <div className="max-w-7xl mx-auto px-4 pl-40">
      <div className="pl-20">
      
      <JobApplicationsTable applications={applications} setApplications={setApplications} />
      </div>
    </div>
    </AdminLayout>
  );
};

export default JobApplicationsAdmin;
