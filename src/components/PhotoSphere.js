import { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";

export default function PhotoSphere({ imageUrl }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && viewerRef.current) {
      console.log("📸 Received imageUrl:", imageUrl);

      if (!imageUrl) {
        console.error("❌ No image URL provided to PhotoSphere.");
        return;
      }

      // ✅ Ensure the image URL is fully qualified
      const validImageUrl = imageUrl.startsWith("http")
  ? imageUrl
  : `http://127.0.0.1:8000/storage/${imageUrl.replace("storage/", "")}`;

console.log("✅ Final Image URL:", validImageUrl);


      fetch(validImageUrl, { method: "HEAD" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`❌ Image not found: ${validImageUrl}`);
          }
          console.log("✅ Image exists:", validImageUrl);

          const viewer = new Viewer({
            container: viewerRef.current,
            panorama: validImageUrl,
            navbar: ["zoom", "move", "fullscreen"],
            loadingTxt: "Loading 360° image...",
          });

          return () => viewer.destroy();
        })
        .catch((error) => {
          console.error("❌ Error loading 360° image:", error);
        });
    }
  }, [imageUrl]);

  return <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />;
}
