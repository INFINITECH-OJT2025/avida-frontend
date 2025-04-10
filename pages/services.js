import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { fetchServices } from "../src/utils/api";
import SEOComponent from "../src/hooks/useSEO";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      }
    };

    loadServices();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <SEOComponent />
      <Header />

      {/* Hero Section */}
      <div className="text-center mt-6 py-20 bg-[#990e15] dark:to-[#990e15] text-white">
        <h1 className="text-4xl font-extrabold">Our Services</h1>
        <p className="text-lg mt-2 text-gray-200 dark:text-gray-300">
          Experience exceptional real estate services, tailored to meet your needs and exceed expectations.
        </p>
      </div>

      {/* Service Listings */}
      <div className="container mx-auto px-6 py-12">
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No services available at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
                  <img
                    src={service.image ? `/storage/${service.image}` : "/images/placeholder.png"}
                    alt={service.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                      {service.description.slice(0, 80)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
