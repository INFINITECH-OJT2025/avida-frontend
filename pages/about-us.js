import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import HeroSection from "../../src/components/user/about/HeroSection";
import CompanyOverview from "../../src/components/user/about/CompanyOverview";
import MissionVision from "../../src/components/user/about/MissionVision";
import OurStory from "../../src/components/user/about/OurStory";
import WhyChooseUs from "../../src/components/user/about/WhyChooseUs";
import Header from "../../src/components/Header";
export default function AboutUsPage() {
    const [about, setAbout] = useState(null);

    useEffect(() => {
        axios.get("/api/about-us").then((res) => {
            if (res.data) setAbout(res.data);
        }).catch(error => console.error("Error fetching About Us data:", error));
    }, []);

    return (
        <>
            <Header/>

            <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white"><Head>
                <title>{about?.company_name || "About Us"} - Avida Land</title>
                <meta name="description" content={about?.brief_intro || "Learn about our company"} />
            </Head>
                {/* 🔹 Hero Section */}
                <HeroSection companyName={about?.company_name} companySlogan={about?.company_slogan} />

                <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                    {/* 🔹 Company Overview */}
                    <CompanyOverview about={about} />

                    {/* 🔹 Mission & Vision */}
                    <MissionVision about={about} />

                    {/* 🔹 Our Story */}
                    <OurStory about={about} />


                    {/* 🔹 Why Choose Us */}
                    <WhyChooseUs about={about} />

                </div>
            </div>
        </>
    );
}
