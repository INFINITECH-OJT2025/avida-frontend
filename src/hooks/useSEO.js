import Head from "next/head";
import { useRouter } from "next/router";

const seoConfig = {
  "/": {
    title: "Welcome to Avida Land - Find Your Dream Home",
    description: "Browse premium real estate listings for sale and rent.",
    image: "/default-property.jpg",
  },
  "/property-comparison": {
    title: "Compare Properties - Find the Best Deal",
    description: "Compare up to four properties side by side and make an informed decision.",
    image: "/property-comparison.jpg",
    keyword: "compare",
  },
  "/properties": {
    title: "Explore Properties - Buy or Rent Real Estate",
    description: "Find your perfect home with our latest property listings.",
    image: "/properties-banner.jpg",
  },
  "/admin/properties": {
    title: "Explore Properties - Buy or Rent Real Estateas",
    description: "Find your perfect home with our latest property listings.",
    image: "/properties-banner.jpg",
  },
  "/news": {
    title: "Latest Real Estate News & Blogs",
    description: "Stay updated with the latest real estate news, trends, blogs, and investment insights.",
    image: "/public/Avida_logo.png",
  },
  "/careers": {
    title: "Explore Job Offers - Apply Now",
    description: "Find your perfect home with our latest property listings.",
    image: "/properties-banner.jpg",
  },
  
};

const SEOComponent = ({ dynamicData = {} }) => {
  const router = useRouter();
  const path = router.pathname;

  // ✅ Get Static SEO Data from Config
  const pageSEO = seoConfig[path] || {};

  // ✅ Use Dynamic Data If Provided (For Property Details Pages)
  const title = dynamicData.title || pageSEO.title || "Avida Land";
  const description = dynamicData.description || pageSEO.description || "Explore top real estate properties.";
  const url = dynamicData.url || `http://localhost:3000${path}`;
  const image = dynamicData.image || pageSEO.image || "/default-property.jpg";

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Open Graph / Facebook Meta */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEOComponent;
