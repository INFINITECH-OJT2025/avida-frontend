// pages/admin/job-applications.js
import { useEffect, useState } from "react";
import AdminLayout from "../../src/components/layout/AdminLayout";
import JobApplicationsTable from "../../src/components/admin/job/JobApplicationsTable";
import { getJobApplications } from "../../src/utils/api";
import { useToast } from "../../src/context/ToastContext";
import SEOComponent from "../../src/hooks/useSEO";
const JobApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast(); // ✅ Toast for errors

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications:", err);
        showToast("Failed to load job applications", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading applications...</p>;

  return (
    <AdminLayout><SEOComponent />
      <div className="max-w-7xl mx-auto px-4 pl-40">
        <div className="pl-20">
          <JobApplicationsTable applications={applications} setApplications={setApplications} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default JobApplicationsAdmin;
