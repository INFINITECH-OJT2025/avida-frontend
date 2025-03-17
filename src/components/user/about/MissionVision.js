export default function MissionVision({ about }) {
    return (
        <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Our Mission & Vision</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-semibold bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Mission</h3>
                    <p className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">{about?.mission_statement}</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Vision</h3>
                    <p className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">{about?.vision_statement}</p>
                </div>
            </div>
        </div>
    );
}
