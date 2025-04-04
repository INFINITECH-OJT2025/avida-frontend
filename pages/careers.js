import { useState, useEffect } from "react";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import SEOComponent from "../src/hooks/useSEO";
import { getPublishedJobs } from "../src/utils/api";
import JobDetail from "../src/components/user/careers/JobDetail";
import JobApplicationForm from "../src/components/admin/job/job-application-form";
import ModalPortal from "../src/components/ModalPortal"; // adjust path accordingly

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getPublishedJobs();

        if (data.length > 0 && data[0].image) {
          setHeroImage(data[0].image); // ✅ get image field from first job
        }

        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();

    document.body.style.overflow = selectedJob || showApplicationForm ? "hidden" : "";
  }, [selectedJob, showApplicationForm]);


  const formatDeadline = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOComponent />
      <Header />

      <section className="relative w-full h-80 px-6 overflow-hidden z-0">
        {/* Background Image */}
        {heroImage && (
          <img
            src={`https://infinitech-api3.site/storage/${heroImage}`}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover z-[-2]"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#990e15] bg-opacity-85 dark:bg-opacity-90 z-[-1]" />

        {/* Foreground Content */}
        <div className="relative z-0 flex flex-col items-center justify-center text-white text-center h-full">
          <h1 className="text-5xl font-bold">Join Our Team</h1>
          <p className="text-lg mt-2 max-w-2xl">
            Discover exciting career opportunities and be part of a dynamic team.
          </p>
        </div>
      </section>


      {/* Job Listings */}
      <section className="max-w-7xl mx-auto py-12 px-6">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No job openings available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                <h2 className="text-2xl font-semibold text-[#990e15] mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  <strong>Department:</strong> {job.department}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  <strong>Apply Before:</strong>{" "}
                  {formatDeadline(job.application_deadline)}
                </p>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  {job.description.length > 120
                    ? job.description.substring(0, 120) + "..."
                    : job.description}
                </p>

                <div className="mt-5 text-right">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-[#990e15] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* Middle Modal: Job Detail */}
      {selectedJob && (
        <ModalPortal>
          <JobDetail
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={() => setShowApplicationForm(true)}
          />
        </ModalPortal>
      )}

      {/* Top Drawer: Job Application Form */}
      {showApplicationForm && (
        <ModalPortal>
          <JobApplicationForm
            jobTitle={selectedJob?.title}
            jobId={selectedJob?.id}
            isOpen={showApplicationForm}
            onClose={() => setShowApplicationForm(false)}
          />
        </ModalPortal>
      )}

      <Footer />


    </div>
  );
};

export default JobListings;
