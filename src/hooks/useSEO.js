import { NextSeo } from "next-seo";

const useSEO = ({ title, description, url, image }) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url: url,
        title: title,
        description: description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        site_name: "Avida Real Estate",
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
