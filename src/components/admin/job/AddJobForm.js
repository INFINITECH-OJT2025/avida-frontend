import { useState } from "react";

const AddJobForm = ({ onClose, onJobAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    job_type: "Full-time",
    salary_min: "",
    salary_max: "",
    application_deadline: "",
    status: "Unpublished",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataObj = new FormData();
    
    // ✅ Ensure required fields are always sent
    formDataObj.append("title", formData.title);
    formDataObj.append("department", formData.department || ""); // Optional
    formDataObj.append("description", formData.description);
    formDataObj.append("responsibilities", formData.responsibilities || "N/A"); // ✅ FIXED
    formDataObj.append("qualifications", formData.qualifications || "N/A"); // Prevent null error
    formDataObj.append("job_type", formData.job_type);
    formDataObj.append("salary_min", formData.salary_min || 0);
    formDataObj.append("salary_max", formData.salary_max || 0);
    formDataObj.append("application_deadline", formData.application_deadline);
    formDataObj.append("status", formData.status);
  
    if (formData.image) {
      formDataObj.append("image", formData.image);
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/jobs", {
        method: "POST",
        body: formDataObj,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Validation Errors:", data.details);
        throw new Error(data.details ? JSON.stringify(data.details) : "Validation failed");
      }
  
      alert("Job added successfully!");
      onJobAdded();
      onClose();
    } catch (error) {
      console.error("Error adding job:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold text-[#990e15] text-center mb-4">Add New Job</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <label className="text-sm font-medium text-gray-700">Job Title</label>
              <input type="text" name="title" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleChange} />

              <label className="text-sm font-medium text-gray-700 mt-2">Department</label>
              <input type="text" name="department" className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleChange} />

              <label className="text-sm font-medium text-gray-700 mt-2">Job Type</label>
              <select name="job_type" className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>

              <label className="text-sm font-medium text-gray-700 mt-2">Application Deadline</label>
              <input type="date" name="application_deadline" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleChange} />

              <label className="text-sm font-medium text-gray-700 mt-2">Job Status</label>
              <select name="status" className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleChange}>
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            </div>

            {/* Right Column */}
            <div>
              <label className="text-sm font-medium text-gray-700">Salary Range (Min - Max)</label>
              <div className="flex space-x-2">
                <input type="number" name="salary_min" placeholder="Min" className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleChange} />
                <input type="number" name="salary_max" placeholder="Max" className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleChange} />
              </div>

              <label className="text-sm font-medium text-gray-700 mt-2">Job Image</label>
              <input type="file" name="image" accept="image/*" className="border p-2 w-full rounded-lg focus:border-[#990e15]" onChange={handleFileChange} />

              <label className="text-sm font-medium text-gray-700 mt-2">Job Description</label>
              <textarea name="description"  className="border p-2 w-full rounded-lg focus:border-[#990e15]" rows="2" onChange={handleChange} />

              <label className="text-sm font-medium text-gray-700 mt-2">Responsibilities</label>
              <textarea name="responsibilities" className="border p-2 w-full rounded-lg focus:border-[#990e15]" rows="2" onChange={handleChange} />

              <label className="text-sm font-medium text-gray-700 mt-2">Qualifications</label>
              <textarea name="qualifications" required className="border p-2 w-full rounded-lg focus:border-[#990e15]" rows="2" onChange={handleChange} />
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <button type="submit" className="bg-[#990e15] text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition">
              Save Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;
