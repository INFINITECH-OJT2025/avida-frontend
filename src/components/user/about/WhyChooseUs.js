export default function WhyChooseUs({ about }) {
    return (
        <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-boldbg-white text-gray-900 dark:bg-gray-900 dark:text-white">Why Choose Us?</h2>
            <p className="mt-3 bg-white text-gray-900 dark:bg-gray-900 dark:text-white leading-relaxed">
                {about?.quality_innovation} <br />
                {about?.prime_locations} <br />
                {about?.affordability_financing} <br />
                {about?.sustainability}
            </p>
        </div>
    );
}
