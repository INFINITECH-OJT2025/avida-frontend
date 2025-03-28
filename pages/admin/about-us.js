import { useState, useEffect } from "react";
import AdminLayout from "../../src/components/layout/AdminLayout";
import CompanyOverview from "../../src/components/admin/about/CompanyOverview";
import DescriptionDetails from "../../src/components/admin/about/DescriptionDetails";
import Features from "../../src/components/admin/about/Features";
import RealEstateServices from "../../src/components/admin/about/RealEstateServices";
import StatusControl from "../../src/components/admin/about/StatusControl";
import { showGlobalToast } from "../../src/utils/toastHandler";
import SEOComponent from "../../src/hooks/useSEO";
import {
  updateAboutDetails,
  updateAboutStatus,
  fetchAboutUs
} from "../../src/utils/api";

export default function AboutUsAdmin() {
  const [form, setForm] = useState({});
  const [editSection, setEditSection] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetchAboutUs();
      setForm(res);
    } catch {
      showGlobalToast("Failed to fetch About Us data!", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (editSection === "statusControl") {
        await updateAboutStatus({ status: form.status });
      } else {
        await updateAboutDetails(form);
      }
      showGlobalToast("Successfully updated About Us!", "success");
      setEditSection(null);
    } catch {
      showGlobalToast("Update failed! Please try again.", "error");
    }
  };

  const sections = [
    // {
    //   title: "Company Overview",
    //   keys: ["company_name", "established_year", "parent_company", "company_slogan"],
    //   Component: CompanyOverview,
    //   sectionKey: "companyOverview"
    // },
    {
      title: "Description Details",
      keys: [
        "brief_intro",
        "mission_statement",
        "vision_statement",
        "our_story",
        "evolution"
      ],
      Component: DescriptionDetails,
      sectionKey: "descriptionDetails"
    },
    {
      title: "Features",
      keys: [
        "quality_innovation",
        "prime_locations",
        "affordability_financing",
        "sustainability",
        "awards"
      ],
      Component: Features,
      sectionKey: "features"
    },
    {
      title: "Real Estate Services",
      keys: [
        "real_estate_services",
        "property_types",
        "investment_opportunities",
        "customer_segments"
      ],
      Component: RealEstateServices,
      sectionKey: "realEstateServices"
    },
    {
      title: "Status Control",
      keys: ["status"],
      Component: StatusControl,
      sectionKey: "statusControl"
    }
  ];

  return (
    <AdminLayout>
            <SEOComponent />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md flex justify-end">
        <div className="w-3/4">
          <h1 className="text-2xl font-bold mb-6 text-right text-[#990e15]">About Us Management</h1>
          {sections.map(({ title, keys, Component, sectionKey }) => (
            <SectionCard
              key={sectionKey}
              title={title}
              data={keys.map((key) => ({ label: formatLabel(key), value: form[key] }))}
              isEditing={editSection === sectionKey}
              toggleEdit={() => setEditSection(editSection === sectionKey ? null : sectionKey)}
              handleUpdate={handleUpdate}
            >
              {editSection === sectionKey && (
                <Component form={form} handleChange={handleChange} setForm={setForm} />
              )}
            </SectionCard>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function SectionCard({ title, data, isEditing, toggleEdit, children, handleUpdate }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-md mb-4 relative border-l-4 border-[#990e15]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#990e15]">{title}</h2>
        <button
          onClick={isEditing ? handleUpdate : toggleEdit}
          className="bg-[#990e15] text-white px-4 py-2 rounded-md ml-4 hover:bg-red-800"
        >
          {isEditing ? "Save" : "Edit"}
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

function formatLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
