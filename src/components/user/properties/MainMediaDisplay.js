import { useEffect, useState } from "react";

export default function MainMediaDisplay({ media, propertyName }) {
    const [isValidImage, setIsValidImage] = useState(false);

    // Get the first media item if available
    const firstMedia = media?.length > 0 ? media[0] : null;
    let imageUrl = firstMedia?.url || "/fallback-image.jpg"; // Fallback if no image is available

    console.log("🔍 Checking Image URL:", imageUrl);

    // Check if the image exists before displaying
    useEffect(() => {
        if (!imageUrl) {
            console.warn("❌ No image URL provided.");
            setIsValidImage(false);
            return;
        }

        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            console.log("✅ Image loaded successfully:", imageUrl);
            setIsValidImage(true);
        };
        img.onerror = () => {
            console.error("❌ Failed to load image:", imageUrl);
            setIsValidImage(false);
        };
    }, [imageUrl]);

    return (
        <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
            {isValidImage ? (
                <img
                    src={imageUrl}
                    alt={propertyName || "Property Image"}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                />
            ) : (
                <p className="text-center text-gray-500">No media available</p>
            )}
        </div>
    );
}
