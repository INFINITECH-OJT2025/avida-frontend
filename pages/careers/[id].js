// pages/jobs/[id].js or wherever the JobDetail component is
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import JobApplicationForm from "../../src/components/admin/job/job-application-form";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { callAPI } from "../../src/utils/api"; // ✅ Import the utility
import SEOComponent from "../../src/hooks/useSEO";
const JobDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (id) {
        try {
          const data = await callAPI("get", `/jobs/${id}`);
          setJob(data);
        } catch (err) {
          console.error("Error fetching job details:", err);
        }
      }
    };

    fetchJobDetails();
  }, [id]);

  if (!job) {
    return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">Loading job details...</p>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
  <SEOComponent />
      <Header />

      <div
        className="relative w-full h-80 bg-cover bg-center flex flex-col items-center justify-center text-white text-center px-6"
        style={{
          backgroundImage: job.image ? `url('https://infinitech-api3.site/storage/${job.image}' || 'http://localhost:8000/storage/${job.image}')` : "none",
        }}
      >
        <div className="absolute inset-0 bg-[#990e15] opacity-85 dark:opacity-90" />
        <h1 className="text-4xl font-bold relative z-10">{job.title}</h1>
        <p className="text-lg mt-2 relative z-10">{job.department}</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 py-10 px-6 dark:bg-gray-900">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
          <div className="border-b pb-4 mb-4 dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Job Type: <span className="text-[#990e15]">{job.job_type}</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Application Deadline: <span className="text-[#990e15]">{formatDate(job.application_deadline)}</span>
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#990e15]">Job Description</h2>
          <p className="text-gray-700 dark:text-gray-300 mt-3">{job.description}</p>

          <h2 className="text-xl font-bold text-[#990e15] mt-6">Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-3">
            {job.responsibilities?.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-[#990e15] mt-6">Qualifications</h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-3">
            {job.qualifications?.split("\n").map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-[#990e15] mt-6">Salary Range</h2>
          <p className="text-gray-700 dark:text-gray-300">
            {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-6">
          <JobApplicationForm jobId={id} />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default JobDetail;
