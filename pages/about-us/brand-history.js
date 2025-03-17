// import { useEffect, useState } from "react";
// import axios from "axios";
// import Head from "next/head";
// // import BrandHistory from "@/components/user/about/BrandHistory";

// export default function BrandHistoryPage() {
//   const [about, setAbout] = useState({});

//   useEffect(() => {
//     axios.get("/api/about-us").then((res) => setAbout(res.data));
//   }, []);

//   return (
//     <>
//       <Head>
//         <title>Brand History - {about.company_name}</title>
//         <meta name="description" content={about.our_story} />
//       </Head>
//       <div className="p-6 max-w-5xl mx-auto">
//         {/* <BrandHistory about={about} /> */}
//       </div>
//     </>
//   );
// }
