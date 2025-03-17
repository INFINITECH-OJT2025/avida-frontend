export default function OurStory({ about }) {
    return (
        <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold bg-white text-gray-900 dark:bg-gray-900 dark:text-white">Our Story</h1>
            <p className="mt-3 bg-white text-gray-900 dark:bg-gray-900 dark:text-white leading-relaxed">{about?.our_story}</p>
        </div>
    );
}
