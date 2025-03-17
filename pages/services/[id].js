import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InquiryForm from "./InquiriesForm";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer"; 

export default function ServiceDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // ✅ Get 'id' from URL

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // ✅ Prevent fetching before ID is available

    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch service details");
        }

        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]); // ✅ Depend on 'id'

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
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
