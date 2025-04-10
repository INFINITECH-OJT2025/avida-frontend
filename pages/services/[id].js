import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InquiryForm from "./InquiriesForm";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { getSingleService } from "../../src/utils/api"; // ✅ NEW
import SEOComponent from "../../src/hooks/useSEO";
export default function ServiceDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [service, setService] = useState(null);
 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchServiceDetails = async () => {
      try {
        const data = await getSingleService(id); // ✅ Use callAPI
        setService(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch service details");
      } finally {
 
      }
    };

    fetchServiceDetails();
  }, [id]);

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!service) {
    return (
      <div>
        <Header />
        <div className="text-center py-24">
          <h1 className="text-2xl text-gray-700">Service not found or is currently unavailable.</h1>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div>      <SEOComponent />
      <Header />
      <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        {/* Left Side - Service Details */}
        <div className="w-full lg:w-2/3">
          <img
            src={service.image ? `/storage/${service.image}` : "/images/placeholder.png"}
            alt={service.title}
            className="w-full h-96 object-cover rounded-md"
          />
          <h1 className="text-4xl font-bold text-gray-900 mt-6">{service.title}</h1>
          <p className="text-gray-700 text-lg mt-4">{service.description}</p>
        </div>

        {/* Right Side - Inquiry Form */}
        <div className="w-full lg:w-1/3">
          <InquiryForm service={service.title} />
        </div>
      </div>
      
      
      <Footer />
    </div>
  );
  
}
