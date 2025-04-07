// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/router";
// import SEOComponent from "../../src/hooks/useSEO";
// import Header from "../../src/components/Header";
// import Footer from "../../src/components/Footer";
// import { XCircle, PlusCircle, X, Loader } from "lucide-react";
// import Image from "next/image";
// import { useToast } from "../../src/context/ToastContext";
// import { callAPI } from "../../src/utils/api"; // ✅ import your shared API handler
// import React from "react";

// const PropertyComparison = () => {
//   const [properties, setProperties] = useState([]);
//   const [selectedProperties, setSelectedProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showComparison, setShowComparison] = useState(false);
//   const router = useRouter();
//   const { toast, showToast } = useToast(); 

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       import("lightbox2").then((Lightbox) => {
//         Lightbox.default.option({
//           resizeDuration: 200,
//           wrapAround: true,
//         });
//       });
//     }
//   }, []);



//   // ✅ Corrected Fetch Properties Function
//   const fetchProperties = useCallback(async () => {
//     try {
//       const data = await callAPI("get", "/properties");
//       console.log("Fetched Properties Data:", data);
  
//       if (!data || !Array.isArray(data)) throw new Error("Invalid property data");
  
//       const formattedProperties = data.map((property) => ({
//         ...property,
//         media: property.media.map((media) => ({
//           ...media,
//           url: media.url.startsWith("http")
//             ? media.url
//             : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "")}/storage/${media.url}`
//         })),
//       }));
  
//       setProperties(formattedProperties);
//     } catch (error) {
//       console.error("Failed to load properties:", error);
//       setError(error.message || "Failed to load properties.");
//       showToast("Failed to load properties. Please try again later.", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, []);
  

//   useEffect(() => {
//     fetchProperties();
//   }, [fetchProperties]);

//   const togglePropertySelection = (property) => {
//     setSelectedProperties((prev) => {
//       if (prev.find((p) => p.id === property.id)) {
//         return prev.filter((p) => p.id !== property.id);
//       } else if (prev.length < 4) {
//         return [...prev, property];
//       } else {
//         showToast("You can only compare up to four properties at a time.");
//         return prev;
//       }
//     });
//   };

//   const clearComparison = () => {
//     setSelectedProperties([]);
//     setShowComparison(false);
//   };

//   return (
//     <>
// <SEOComponent
//   dynamicData={{
//     title: "Compare Properties | Avida Land",
//     description: "Select and compare up to four real estate properties to find your best match. Analyze features, price, amenities and more.",
//     image: "/property-comparison.jpg",
//     url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}${router.asPath}`,
//   }}
// />

//       <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">

//         <Header />

//         <div className="bg-[#990e15] text-white py-16 text-center">
//           <h1 className="text-5xl font-extrabold">Compare Properties & Make the Best Choice</h1>
//           <p className="text-lg text-gray-200 mt-3">Select up to four properties and compare their features side by side.</p>
//         </div>

//         <div className="max-w-7xl mx-auto px-6 py-12">
//           <h2 className="text-2xl font-bold text-[#990e15] text-center mb-6">Select Properties to Compare</h2>
//           {loading ? (
//             <div className="flex justify-center"><Loader className="animate-spin text-[#990e15] w-10 h-10" /></div>
//           ) : error ? (
//             <p className="text-center text-red-600">{error}</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {properties.map((property) => (
//                 <div
//                   key={property.id}
//                   className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:scale-105 ${selectedProperties.find((p) => p.id === property.id) ? "border-4 border-[#990e15]" : ""
//                     }`}
//                   onClick={() => togglePropertySelection(property)}
//                 >
//                   <Image
//                     src={property.media.length > 0 ? property.media[0].url : "/default-property.jpg"}
//                     alt={property.property_name}
//                     width={500}
//                     height={300}
//                     layout="responsive"
//                     objectFit="cover"
//                   />
//                   <button
//                     className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       togglePropertySelection(property);
//                     }}
//                   >
//                     {selectedProperties.find((p) => p.id === property.id) ? (
//                       <XCircle className="text-red-500" />
//                     ) : (
//                       <PlusCircle className="text-green-500" />
//                     )}
//                   </button>
//                   <div className="p-4">
//                     <h2 className="text-xl font-bold text-[#990e15] truncate">{property.unit_type} | {property.property_name}</h2>
//                     <p className="text-gray-600 truncate">{property.location}</p>
//                     <p className="text-lg font-bold mt-2">
//   ₱{parseFloat(property.price).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// </p>

//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {selectedProperties.length > 0 && (
//           <div className="fixed bottom-5 right-5 z-50 bg-white p-4 shadow-md rounded-lg">
//             <button className="bg-[#990e15] text-white px-6 py-3 rounded-lg font-bold" onClick={() => setShowComparison(true)}>Compare ({selectedProperties.length})</button>
//             <button className="text-gray-600 ml-3" onClick={clearComparison}>Clear</button>
//           </div>
//         )}

//         {showComparison && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center p-4">
//             <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl max-w-5xl w-full overflow-auto border dark:border-gray-700">

//               {/* ✅ Header */}
//               <div className="flex justify-between items-center mb-3">
//                 <h2 className="text-xl font-extrabold text-[#990e15] dark:text-white">📊 Property Comparison</h2>
//                 <button onClick={clearComparison} className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
//                   <X className="text-gray-800 dark:text-white w-5 h-5" />
//                 </button>
//               </div>

//               {/* ✅ Comparison Table */}
//               <table className="w-full border-collapse text-left dark:bg-gray-800 dark:text-white rounded-lg overflow-hidden shadow-md text-xs">
//                 <thead className="bg-[#990e15] text-white">
//                   <tr>
//                     <th className="p-3 text-left">Feature</th>
//                     {selectedProperties.map((p) => (
//                       <th key={p.id} className="p-3 text-center font-bold">
//                         {p.property_name}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-500 dark:divide-gray-700">

//                   {/* ✅ Media Comparison */}
//                   <tr className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
//                     <td className="p-2 font-bold flex items-center">📷 Images / Media</td>

//                     {selectedProperties.map((p) => (
//                       <td key={p.id} className="p-2">
//                         {/* ✅ Image Thumbnails (Up to 3) */}
//                         <div className="flex justify-center gap-2">
//                           {p.media
//                             .filter(media => media.type === "image")
//                             .slice(0, 3) // Show max 3 images
//                             .map((media, index) => (
//                               <a
//                                 key={index}
//                                 href={media.url}
//                                 data-lightbox={`property-gallery-${p.id}`}
//                                 className="rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition"
//                               >
//                                 <Image
//                                   src={media.url}
//                                   alt={`Image ${index + 1}`}
//                                   width={70}
//                                   height={70}
//                                   objectFit="cover"
//                                   className="rounded-lg border border-gray-400 dark:border-gray-600"
//                                 />
//                               </a>
//                             ))}
//                         </div>

//                         {/* ✅ 360° Panorama (If Available) */}
//                         {p.media.some(media => media.type === "360") && (
//                           <div className="mt-2 flex justify-center">
//                             {p.media
//                               .filter(media => media.type === "360")
//                               .slice(0, 1) // Show first panorama
//                               .map((media, index) => (
//                                 <a key={index} href={media.url} data-lightbox={`property-360-${p.id}`} className="block">
//                                   <Image
//                                     src={media.url}
//                                     alt="360° View"
//                                     width={80}
//                                     height={50}
//                                     objectFit="cover"
//                                     className="rounded-lg shadow-md border border-gray-400 dark:border-gray-600 cursor-pointer hover:shadow-xl transition"
//                                   />
//                                 </a>
//                               ))}
//                           </div>
//                         )}
//                       </td>
//                     ))}
//                   </tr>

//                   {/* ✅ Property Feature Comparison */}
//                   {["price", "location", "unit_status", "unit_type", "square_meter", "floor_number", "parking", "property_status", "features_amenities"].map((key, index) => (
//                     <tr
//                       key={key}
//                       className={`hover:bg-gray-200 dark:hover:bg-gray-700 transition ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""
//                         }`}
//                     >
//                       <td className="p-2 font-bold text-gray-700 dark:text-gray-300 capitalize">
//                         {key.replace("_", " ")}
//                       </td>

//                       {selectedProperties.map((p) => (
//                         <td key={p.id} className="p-2">
//                           {key === "price" ? (
//                             `₱${Number(p[key]).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
//                           ) : key === "features_amenities" ? (
//                             (() => {
//                               try {
//                                 // ✅ Ensure features_amenities is parsed correctly
//                                 const amenities = typeof p[key] === "string" ? JSON.parse(p[key]) : p[key];

//                                 return (
//                                   <ul className="list-disc list-inside">
//                                     {amenities.map((amenity, i) => (
//                                       <li key={i} className="text-gray-700 dark:text-gray-300">
//                                         {amenity}
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 );
//                               } catch (error) {
//                                 console.error("Error parsing amenities:", error);
//                                 return <span className="text-red-500">Invalid Data</span>;
//                               }
//                             })()
//                           ) : (
//                             p[key]
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}

//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }
// export default PropertyComparison;