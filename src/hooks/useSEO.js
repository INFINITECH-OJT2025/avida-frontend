import { NextSeo } from "next-seo";

const useSEO = ({ 
  title = "Avida Real Estate - Find Your Dream Home", 
  description = "Discover premium properties for sale and rent.", 
  url = "http://localhost:3000", 
  image = "/default-seo.jpg" 
}) => {
  if (!title || !description || !url) return null; // ✅ Prevent rendering if missing

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        type: "website",
        locale: "en_PH",
        url: url,
        title: title,
        description: description,
        images: [
          {
            url: image || "/default-seo.jpg",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        site_name: "Avida Land Real Estate",
      }}
      twitter={{
        handle: "@AvidaRealEstate",
        site: "@AvidaRealEstate",
        cardType: "summary_large_image",
      }}
    />
  );
};

export default useSEO;
