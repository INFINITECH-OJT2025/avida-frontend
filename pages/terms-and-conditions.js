// pages/terms.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEOComponent from "@/hooks/useSEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublicTerms } from "@/utils/api";

export default function TermsPage() {
  const [policy, setPolicy] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getPublicTerms()
      .then(setPolicy)
      .catch(() => router.push("/404"));
  }, []);

  return (
    <>
      <Header />
      <SEOComponent title="Terms and Conditions" description="Review our website's terms of service and usage policies." />
      <main className="max-w-5xl mt-10 mx-auto px-6 py-12 text-gray-800">
        {policy && (
          <>
            <h1 className="text-3xl font-bold text-[#990e15] mb-2">{policy.main_title}</h1>
            <p className="text-sm text-gray-500 mb-6">{policy.sub_title}</p>
            {policy.description && <p className="mb-8 whitespace-pre-line">{policy.description}</p>}
            {policy.sections?.map((section, idx) => (
              <div key={idx} className="mb-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-[#990e15] mb-2">{section.title}</h2>
                {section.description && <p className="mb-3 whitespace-pre-line">{section.description}</p>}
                {Array.isArray(section.details) && section.details.length > 0 && (
                  <ul className="list-disc list-inside mb-3 space-y-1">
                    {section.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                )}
                {/* {Array.isArray(section.examples) && section.examples.length > 0 && (
                  <div className="overflow-x-auto mb-3">
                    <table className="w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-3 py-2 w-1/3">Category</th>
                          <th className="border px-3 py-2">Examples</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.examples.map((ex, i) => (
                          <tr key={i}>
                            <td className="border px-3 py-2">{ex.category}</td>
                            <td className="border px-3 py-2 whitespace-pre-line">{ex.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )} */}
                {section.explanation && <p className="text-sm italic text-gray-600 mb-2">{section.explanation}</p>}
                {section.image_url && (
                  <img src={section.image_url} alt={section.title} className="mt-4 max-w-full rounded shadow" />
                )}
              </div>
            ))}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
