import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import MediaDisplay from "./MediaDisplay";
import Image from "next/image";

export default function PropertyViewer({ property, onClose }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <Dialog open={!!property} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[#990e15]">
            {property?.property_name}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            {property?.location}
          </DialogDescription>
        </DialogHeader>

        <hr className="my-4" />

        {/* 🖼️ Media Section */}
        {property?.media && (
          <div className="mb-6 ">
            <MediaDisplay
              media={property.media}
              propertyName={property.property_name}
            />
          </div>
        )}

        {/* 📋 Property Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-4 text-sm text-gray-800">
          {/* 🔹 Left Column (Column 1) */}
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-gray-700">Price:</span>{" "}
              {formatPrice(property?.price)}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Unit Type:</span>{" "}
              {property?.unit_type || "N/A"}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Unit Status:</span>{" "}
              {property?.unit_status || "N/A"}
            </div>
          </div>

          {/* 🔹 Middle Column (Column 2) */}
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-gray-700">Parking:</span>{" "}
              {property?.parking || "N/A"}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Square Meter:</span>{" "}
              {property?.square_meter || "N/A"} sqm
            </div>
            <div>
              <span className="font-semibold text-gray-700">Floor Number:</span>{" "}
              {property?.floor_number || "N/A"} floor/s
            </div>
            <div>
              <span className="font-semibold text-gray-700">Property Status:</span>{" "}
              {property?.property_status || "N/A"}
            </div>
          </div>

          {/* 🔹 Right Column (Column 3) - Amenities */}
          <div>
            <span className="font-semibold text-gray-700">Features and Amenities:</span>{" "}
            {(() => {
              const amenities = property?.features_amenities;
              try {
                const parsed =
                  typeof amenities === "string" && amenities.startsWith("[")
                    ? JSON.parse(amenities)
                    : amenities;

                if (Array.isArray(parsed)) {
                  return (
                    <ul className="list-disc list-inside ml-4 text-sm text-gray-600 space-y-1 mt-1">
                      {parsed.map((item, index) => (
                        <li key={index}>{item.replace(/['"]+/g, "")}</li>
                      ))}
                    </ul>
                  );
                }

                if (typeof amenities === "string") {
                  return (
                    <ul className="list-disc list-inside ml-4 text-sm text-gray-600 space-y-1 mt-1">
                      {amenities.split(",").map((item, i) => (
                        <li key={i}>{item.trim().replace(/['"\[\]]+/g, "")}</li>
                      ))}
                    </ul>
                  );
                }

                return <span className="text-gray-500">N/A</span>;
              } catch (e) {
                console.error("❌ Error parsing amenities:", e);
                return <span className="text-red-500 text-sm">Invalid format</span>;
              }
            })()}
          </div>
        </div>


      </DialogContent>
    </Dialog>
  );
}
