export default function CompanyOverview({ about }) {
    return (
        <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold bg-white text-gray-900 dark:bg-gray-900 dark:text-white">About {about?.company_name}</h2>
            <p className="mt-3 bg-white text-gray-900 dark:bg-gray-900 dark:text-white leading-relaxed">{about?.brief_intro}</p>
        </div>
    );
}
