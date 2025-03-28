// pages\admin\jobs.js

import { useState } from "react";
import JobTable from "../../src/components/admin/job/JobTable";
import JobModal from "../../src/components/admin/job/JobModal";
import AddJobForm from "../../src/components/admin/job/AddJobForm";
import EditJobForm from "../../src/components/admin/job/EditJobForm";
import AdminLayout from "../../src/components/layout/AdminLayout";
import { useToast } from "../../src/context/ToastContext"; // ✅ Import ToastContext
import { callAPI } from "../../src/utils/api"; // ✅ Import callAPI
import SEOComponent from "../../src/hooks/useSEO";
const JobPage = () => {
  const { showToast } = useToast();

  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleDelete = async (jobId) => {
    try {
      await callAPI("delete", `/jobs/${jobId}`);
      showToast("✅ Job deleted successfully!", "success");
      setRefresh((prev) => !prev); // ✅ Refresh the list
    } catch (error) {
      showToast("❌ Failed to delete job.", "error");
      console.error("Error deleting job:", error);
    }
  };
  
  return (
    <AdminLayout> <SEOComponent />
      <div className="flex flex-col items-center space-y-6 p-6">
        <JobTable 
          key={refresh} 
          onView={setSelectedJob} 
          onEdit={setEditingJob} 
          onDelete={handleDelete} 
          onAdd={() => setShowAddModal(true)} 
        />

        {/* Add Job Modal */}
        {showAddModal && (
          <AddJobForm 
            onClose={() => setShowAddModal(false)} 
            onJobAdded={() => setRefresh(!refresh)} 
          />
        )}

        {/* Job Details Modal */}
        <JobModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />

        {/* Edit Job Modal */}
        {editingJob && (
          <EditJobForm 
            job={editingJob} 
            onClose={() => setEditingJob(null)} 
            onJobUpdated={() => setRefresh(!refresh)} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default JobPage;
