import UserLayout from '@/components/layout/UserLayout';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <UserLayout>
      {/* Hero Section with Video Background */}
      <section className="relative flex items-center justify-center h-screen overflow-hidden pt-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <video
          autoPlay
          loop
          muted
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        >
          <source src="/Home_advertisements.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white italic font-serif mb-4">
            <span className="italic font-semibold drop-shadow-lg">Live Sure. Live Inspired.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Experience inspired living that is easy, distinct, and enriching. Celebrate life every day in our condo and house and lot communities across the Philippines.
          </p>
          <button className="bg-[#990e15] hover:bg-red-800 text-white py-3 px-8 rounded-lg font-medium transition duration-300">
            Browse Listings
          </button>
        </div>

        {/* Dark/Light Mode Toggle */}
        <div className="absolute top-24 right-4 z-20">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded-full shadow transition duration-300"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </section>
    </UserLayout>
  );
}
