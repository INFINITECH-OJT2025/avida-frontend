import React from "react";

const JobDetail = ({ job, onClose, onApply }) => {
  if (!job) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatSalary = (value) => {
    if (!value) return null;
    return `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 overflow-y-auto px-4 py-10">
      <div className="w-full mt-20 max-w-6xl mx-auto bg-white rounded-xl shadow-2xl">
        {/* Sticky Banner Section */}
        <div className="sticky top-0 z-50 bg-[#990e15] text-white text-center px-6 py-6 rounded-t-xl shadow-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-8    md:top-4 md:right-6 text-2xl font-bold text-white hover:text-red-300 z-20"
          >
            ✕
          </button>

          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm">{job.department}</p>

          <div className="mt-3 space-y-1 text-sm">
            <p>
              Job Type:{" "}
              <span className="text-yellow-300">{job.job_type}</span>
            </p>
            <p>
              Deadline:{" "}
              <span className="text-yellow-300">
                {formatDate(job.application_deadline)}
              </span>
            </p>
            {(job.salary_min > 0 || job.salary_max > 0) && (
              <p>
                Salary:{" "}
                <span className="text-yellow-300">
                  {job.salary_min > 0 && formatSalary(job.salary_min)}
                  {job.salary_min > 0 && job.salary_max > 0 && " - "}
                  {job.salary_max > 0 && formatSalary(job.salary_max)}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Job Description */}
          <div>
            <h2 className="text-xl font-bold text-[#990e15] mb-2">Job Description</h2>
            <p className="whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <h2 className="text-xl font-bold text-[#990e15] mb-2">Responsibilities</h2>
              <ul className="list-disc list-inside">
                {job.responsibilities.split("\n").map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && (
            <div>
              <h2 className="text-xl font-bold text-[#990e15] mb-2">Qualifications</h2>
              <ul className="list-disc text-sm list-inside">
                {job.qualifications.split("\n").map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>

              <div className="mt-6 text-right">
                <button
                  onClick={onApply}
                  className="bg-[#990e15] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
