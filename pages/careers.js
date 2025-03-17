import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import usePageSEO from "../src/hooks/useSEO";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/published")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {usePageSEO({
        title: "Avida Real Estate - Find Your Dream Home",
        description: "Discover the best real estate properties for sale and rent.",
        url: "http://localhost:3000/",
        image: "/seo-default-image.jpg",
      })}
      <Header />
      {/* Hero Section */}
      <div className="relative w-full h-80 bg-[#990e15] dark:bg-[#770a10] flex flex-col items-center justify-center text-white text-center px-6">
        <h1 className="text-5xl font-bold">Join Our Team</h1>
        <p className="text-lg mt-2 max-w-2xl">Discover exciting career opportunities and be part of a dynamic team.</p>
      </div>

      {/* Job Listings Section */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No job openings available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-xl p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
                <h2 className="text-2xl font-semibold text-[#990e15] mb-2">{job.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{job.department} | Apply Before {new Date(job.application_deadline).toDateString()}</p>
                <p className="text-gray-700 dark:text-gray-400 mt-3 text-sm">{job.description.substring(0, 120)}...</p>
                <div className="mt-4 flex justify-end">
                  <Link href={`/careers/${job.id}`} className="bg-[#990e15] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default JobListings;
