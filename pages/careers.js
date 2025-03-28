import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import SEOComponent from "../src/hooks/useSEO";
import { getPublishedJobs } from "../src/utils/api";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getPublishedJobs(); // ✅ Use central API
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const formatDeadline = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <SEOComponent />
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-80 bg-[#990e15] dark:bg-[#770a10] flex flex-col items-center justify-center text-white text-center px-6">
        <h1 className="text-5xl font-bold">Join Our Team</h1>
        <p className="text-lg mt-2 max-w-2xl">
          Discover exciting career opportunities and be part of a dynamic team.
        </p>
      </section>

      {/* Job Listings Section */}
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
                  <strong>Apply Before:</strong> {formatDeadline(job.application_deadline)}
                </p>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  {job.description.length > 120
                    ? job.description.substring(0, 120) + "..."
                    : job.description}
                </p>

                <div className="mt-5 text-right">
                  <Link
                    href={`/careers/${job.id}`}
                    className="bg-[#990e15] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default JobListings;
