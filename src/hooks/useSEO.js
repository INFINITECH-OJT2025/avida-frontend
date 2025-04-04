// src/hooks/useSEO.js
import Head from "next/head";
import { useRouter } from "next/router";
import seoConfig from "../utils/seoConfig";

const normalizePath = (path) => {
  const dynamicRoutes = [
    "/property/[id]",
    "/careers/[id]",
    "/news/[id]",
    "/services/[id]",
  ];

  for (let route of dynamicRoutes) {
    const base = route.replace("/[id]", "");
    if (path.startsWith(base)) return route;
  }

  return path;
};

const SEOComponent = ({ dynamicData = {} }) => {
  const router = useRouter();
  const currentPath = normalizePath(router.asPath);

  const defaultSEO = seoConfig[currentPath] || {};

  // ✅ PRIORITY: Use dynamicData if passed → then defaultSEO → then fallback
  const title = dynamicData?.title ?? defaultSEO.title ?? "Avida Land";
  const description = dynamicData?.description ?? defaultSEO.description ?? "Explore top real estate properties.";
  const image = dynamicData?.image ?? defaultSEO.image ?? "/default-property.jpg";
  const url = dynamicData?.url ?? `https://avidaland.vercel.app${router.asPath}` ?? `http://localhost:3001${router.asPath}`;

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
