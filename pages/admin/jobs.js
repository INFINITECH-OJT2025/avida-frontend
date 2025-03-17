import { useState } from "react";
import JobTable from "../../src/components/admin/job/JobTable";
import JobModal from "../../src/components/admin/job/JobModal";
import AddJobForm from "../../src/components/admin/job/AddJobForm";
import EditJobForm from "../../src/components/admin/job/EditJobForm";
import AdminLayout from "../../src/components/layout/AdminLayout";

const JobPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <AdminLayout> {/* ✅ Wrap content inside AdminLayout */}
      <div className="flex flex-col items-center space-y-6 p-6">
        <JobTable 
          key={refresh} 
          onView={setSelectedJob} 
          onEdit={setEditingJob} 
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
