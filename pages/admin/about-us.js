import { useState, useEffect } from "react";
import axios from "axios";
import CompanyOverview from "../../src/components/admin/about/CompanyOverview";
import DescriptionDetails from "../../src/components/admin/about/DescriptionDetails";
import Features from "../../src/components/admin/about/Features";
import RealEstateServices from "../../src/components/admin/about/RealEstateServices";
import StatusControl from "../../src/components/admin/about/StatusControl";
import ImagesSection from "../../src/components/admin/about/ImagesSection";
import AdminLayout from "../../src/components/layout/AdminLayout";

export default function AboutUsAdmin() {
    const [form, setForm] = useState({});
    const [editSection, setEditSection] = useState(null);

    useEffect(() => {
        axios.get("/api/admin/about-us").then((res) => setForm(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md flex justify-end">
                <div className="w-3/4">
                    <h1 className="text-2xl font-bold mb-6 text-right text-[#990e15]">About Us Management</h1>

                    {/* 📌 Company Images Section */}
                    {/* <ImagesSection form={form} /> */}

                    {/* 📌 Company Overview */}
                    {/* <Card
                        title="Company Overview"
                        data={[
                            { label: "Company Name", value: form.company_name },
                            { label: "Established Year", value: form.established_year },
                            { label: "Parent Company", value: form.parent_company },
                            { label: "Company Slogan", value: form.company_slogan }
                        ]}
                        isEditing={editSection === "companyOverview"}
                        toggleEdit={() => setEditSection(editSection === "companyOverview" ? null : "companyOverview")}
                    >
                        {editSection === "companyOverview" && <CompanyOverview form={form} handleChange={handleChange} />}
                    </Card> */}

                    {/* 📌 Other Sections */}
                    <Card
                        title="Description Details"
                        data={[
                            { label: "Brief Intro", value: form.brief_intro },
                            { label: "Mission Statement", value: form.mission_statement },
                            { label: "Vision Statement", value: form.vision_statement },
                            { label: "Our Story", value: form.our_story },
                            { label: "Evolution", value: form.evolution }
                        ]}
                        isEditing={editSection === "descriptionDetails"}
                        toggleEdit={() => setEditSection(editSection === "descriptionDetails" ? null : "descriptionDetails")}
                    >
                        {editSection === "descriptionDetails" && <DescriptionDetails form={form} handleChange={handleChange} />}
                    </Card>

                    <Card
                        title="Features"
                        data={[
                            { label: "Quality & Innovation", value: form.quality_innovation },
                            { label: "Prime Locations", value: form.prime_locations },
                            { label: "Affordability & Financing", value: form.affordability_financing },
                            { label: "Sustainability", value: form.sustainability },
                            { label: "Awards", value: form.awards }
                        ]}
                        isEditing={editSection === "features"}
                        toggleEdit={() => setEditSection(editSection === "features" ? null : "features")}
                    >
                        {editSection === "features" && <Features form={form} handleChange={handleChange} />}
                    </Card>

                    <Card
                        title="Real Estate Services"
                        data={[
                            { label: "Services", value: form.real_estate_services },
                            { label: "Property Types", value: form.property_types },
                            { label: "Investment Opportunities", value: form.investment_opportunities },
                            { label: "Customer Segments", value: form.customer_segments }
                        ]}
                        isEditing={editSection === "realEstateServices"}
                        toggleEdit={() => setEditSection(editSection === "realEstateServices" ? null : "realEstateServices")}
                    >
                        {editSection === "realEstateServices" && <RealEstateServices form={form} handleChange={handleChange} />}
                    </Card>

                    <Card
                        title="Status Control"
                        data={[{ label: "Status", value: form.status }]}
                        isEditing={editSection === "statusControl"}
                        toggleEdit={() => setEditSection(editSection === "statusControl" ? null : "statusControl")}
                    >
                        {editSection === "statusControl" && <StatusControl form={form} handleChange={handleChange} />}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

/* 🔹 Reusable Card Component */
function Card({ title, data, isEditing, toggleEdit, children }) {
    return (
        <div className="bg-white p-4 shadow-md rounded-md mb-4 relative border-l-4 border-[#990e15]">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#990e15]">{title}</h2>
                <button onClick={toggleEdit} className="bg-[#990e15] text-white px-4 py-2 rounded-md ml-4 hover:bg-red-800">
                    {isEditing ? "Cancel" : "Edit"}
                </button>
            </div>

            {!isEditing ? (
                <div className="mt-3 space-y-2 text-right">
                    {data.map((item, index) => (
                        <div key={index}>
                            <strong>{item.label}:</strong> {item.value || "Not Set"}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-3">{children}</div>
            )}
        </div>
    );
}
