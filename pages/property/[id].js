import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSEO from "../../src/hooks/useSEO";
import Header from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import MainMediaDisplay from "../../src/components/user/properties/MainMediaDisplay";
import Appointment from "../appointment";

export default function PropertyPage() {
    const router = useRouter();
    const { id } = router.query;
    const [property, setProperty] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!id || !isClient) return;

        async function fetchProperty() {
            setLoading(true);
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/properties/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

                const data = await res.json();
                console.log("Fetched Property Data:", data);

                if (!data || Object.keys(data).length === 0)
                    throw new Error("Property not found");

                data.media = Array.isArray(data.media) ? data.media : [];
                setProperty(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProperty();
    }, [id, isClient]);

    // ✅ Format the price to PHP currency format
    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return "₱0.00";
        return `₱${parseFloat(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    if (!isClient) return <p className="text-center text-gray-600 mt-10">Initializing...</p>;
    if (loading) return <p className="text-center text-gray-600 mt-10">Loading property details...</p>;
    if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

    return (
        <div className="dark:bg-gray-900">
            {useSEO({
                title: `${property.property_name} - Buy or Rent | Avida Land`,
                description: `${property.property_name} located in ${property.location}. Price: ${formatCurrency(property.price)}.`,
                url: `http://localhost:3000/property/${id}`,
                image: property.media.length > 0 ? property.media[0].url : "/default-property.jpg",
            })}
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-20 bg-gray-100 dark:bg-gray-900">

                {/* ✅ Property Content Grid (Left: Media, Right: Details & Appointment in one card) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                    {/* ✅ Left Section - Property Name, Location, and Media */}
                    <div>
                        <h1 className="text-4xl font-extrabold text-[#990e15]">{property.property_name}</h1>
                        <p className="text-lg text-gray-500 mt-2">{property.location}</p>

                        {/* ✅ Property Media Section */}
                        <div className="mt-6 grid grid-cols-1 gap-4">
                            <MainMediaDisplay media={property.media} propertyName={property.property_name} />

                            {/* ✅ Additional Media Gallery */}
                            <div className="grid grid-cols-2 gap-4">
                                {property.media.length > 1 ? (
                                    property.media.slice(1).map((media, index) =>
                                        media.type === "video" ? (
                                            <video
                                                key={index}
                                                src={media.url}
                                                controls
                                                className="w-full h-40 object-cover rounded-lg shadow-md"
                                            />
                                        ) : (
                                            <a key={index} href={media.url} data-lightbox="property-gallery">
                                                <img
                                                    src={media.url}
                                                    className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer"
                                                />
                                            </a>
                                        )
                                    )
                                ) : (
                                    <p className="text-gray-500 col-span-2">No additional media</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ✅ Right Section - Property Details & Appointment Form inside the same card */}
                    <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md flex flex-col space-y-6 w-full">

                        <h2 className="text-2xl font-semibold text-[#990e15]">Property Details</h2>

                        {/* ✅ Grid Layout for Details & Appointment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-md text-gray-700">
                            {/* ✅ Left - Property Details */}
                            <div className="space-y-2">
                                <p><strong>Type:</strong> {property.unit_type}</p>
                                <p><strong>Status:</strong> {property.unit_status}</p>
                                <p><strong>Price:</strong> {formatCurrency(property.price)}</p>
                                <p><strong>Size:</strong> {property.square_meter} sqm</p>
                                <p><strong>Floor Number:</strong> {property.floor_number}</p>
                                <p><strong>Parking:</strong> {property.parking}</p>
                                <p><strong>Property Status:</strong> {property.property_status}</p>
                                <p><strong>Features & Amenities:</strong> {property.features_amenities ? JSON.parse(property.features_amenities).join(", ") : "None"}</p>
                            </div>

                            {/* ✅ Right - Appointment Form Inside Property Details */}
                            <div className="border-l pl-6">
                                <h3 className="text-xl font-semibold text-[#990e15] mb-2">Book an Appointment</h3>
                                <Appointment />
                            </div>
                        </div>

                        {/* ✅ Advertisement Section (Instead of Suggested Properties) */}
                        <div className="mt-6 text-center bg-gray-100 p-5 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-[#990e15]">Looking for More Options?</h3>
                            <p className="text-gray-600 mt-2">
                                Explore a wide range of premium properties suited for your lifestyle.
                                Find your dream home today!
                            </p>
                            <a
                                href="/properties"
                                className="mt-4 inline-block bg-[#990e15] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition duration-300"
                            >
                                Explore More Properties
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
