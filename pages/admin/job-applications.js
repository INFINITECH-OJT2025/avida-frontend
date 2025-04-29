// pages/admin/job-applications.js
import { useEffect, useState } from "react";
import AdminLayout from "../../src/components/layout/AdminLayout";
import JobApplicationsTable from "../../src/components/admin/job-application/JobApplicationsTable";
import { getJobApplications } from "../../src/utils/api";
import { useToast } from "../../src/context/ToastContext";
import SEOComponent from "../../src/hooks/useSEO";

const JobApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications:", err);
        showToast("Failed to load job applications", "error");
      }
    };

    fetchApplications();
  }, []);

  return (
    <AdminLayout>
      <SEOComponent />
      <div className="px-8 py-4 ml-40 ">
        <div className="w-full">
          <JobApplicationsTable applications={applications} setApplications={setApplications} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default JobApplicationsAdmin;
