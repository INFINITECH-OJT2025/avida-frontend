// src/hooks/useSEO.js
import Head from "next/head";
import { useRouter } from "next/router";
import seoConfig from "../utils/seoConfig"; // Adjust path as needed

const SEOComponent = ({ dynamicData = {} }) => {
  const router = useRouter();
  const path = router.pathname;

  const pageSEO = seoConfig[path] || seoConfig[router.asPath] || {};

  const title = dynamicData.title || pageSEO.title || "Avida Land";
  const description = dynamicData.description || pageSEO.description || "Explore top real estate properties.";
  const url = dynamicData.url || `http://localhost:3000${router.asPath}`;
  const image = dynamicData.image || pageSEO.image || "/default-property.jpg";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEOComponent;
