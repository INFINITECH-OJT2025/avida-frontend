import useSEO from "@/hooks/useSEO";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);

  useEffect(() => {
    // Fetch property data from API
    async function fetchProperty() {
      const res = await fetch(`/api/properties/${id}`);
      const data = await res.json();
      setProperty(data);
    }
    if (id) fetchProperty();
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <>
      {useSEO({
        title: `${property.name} - Buy or Rent | Avida Land`,
        description: property.description,
        url: `https://yourwebsite.com/property/${id}`,
        image: property.image,
      })}
      <h1>{property.name}</h1>
      <p>{property.description}</p>
    </>
  );
}
