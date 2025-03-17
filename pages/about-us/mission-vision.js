import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import MissionVision from "../../src/components/user/about/MissionVision";

export default function MissionVisionPage() {
  const [about, setAbout] = useState({});

  useEffect(() => {
    axios.get("/api/about-us").then((res) => setAbout(res.data));
  }, []);

  return (
    <>
      <Head>
        <title>Mission & Vision - {about.company_name}</title>
        <meta name="description" content={about.mission_statement} />
      </Head>
      <div className="p-6 max-w-5xl mx-auto">
        <MissionVision about={about} />
      </div>
    </>
  );
}
