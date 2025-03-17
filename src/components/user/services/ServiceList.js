import Link from "next/link";

export default function ServiceCard({ service }) {
  return (
    <Link href={`/service/${service.slug}`}>
      <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
        <div className="relative">
          <img
            src={service.image ? `/storage/${service.image}` : "/images/placeholder.png"}
            alt={service.title}
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="absolute top-2 right-2 bg-[#990e15] text-white px-3 py-1 rounded">
            {service.status ? "Available" : "Not Available"}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">{service.title}</h3>
        <p className="text-gray-600 text-sm mt-2">{service.description.slice(0, 80)}...</p>
      </div>
    </Link>
  );
}
