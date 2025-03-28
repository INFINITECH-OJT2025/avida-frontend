// src\components\admin\job\JobList.js
import { useEffect, useState } from "react";
import { callAPI } from "../../../utils/api"; // ✅ Adjusted relative path

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    callAPI("get", "/jobs/published")
      .then((data) => setJobs(data))
      .catch((err) => {
        console.error("Failed to fetch job listings:", err);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Job Openings</h2>
      {jobs.length === 0 ? (
        <p>No job openings available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border p-4 rounded shadow">
              {job.image && (
                <img
                  src={`/storage/${job.image}`}
                  alt={job.title}
                  className="w-full h-40 object-cover mb-3"
                />
              )}
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p><strong>Department:</strong> {job.department}</p>
              <p><strong>Type:</strong> {job.job_type}</p>
              <p><strong>Salary:</strong> ₱{job.salary_min} - ₱{job.salary_max}</p>
              <p><strong>Application Deadline:</strong> {job.application_deadline}</p>
              <button className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
