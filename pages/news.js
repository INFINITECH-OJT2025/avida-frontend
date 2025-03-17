import { useEffect, useState } from "react";
import Link from "next/link";
import useSEO from "../src/hooks/useSEO";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/news");
        const data = await res.json();
        console.log("✅ API Response:", data); // ✅ Debugging API response
        setNews(data);
        setFilteredNews(data);
      } catch (error) {
        console.error("❌ Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);


  // Handle category filter
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter((post) => post.category === category));
    }
  };

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading news...</p>;

  return (
    <>
      {useSEO({
        title: "Latest News & Blogs - Avida",
        description: "Stay updated with the latest news, blogs, and updates from Avida.",
        url: "http://localhost:3000/news",
      })}
      <Header />
      {/* ✅ Hero Section */}
      <section className="relative bg-[#990e15] dark:bg-[#770a10] text-white py-20 text-center">

        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold">What's New</h1>
          <p className="mt-4 text-lg text-gray-200">
            Stay updated with the latest insights, trends, and updates from Avida.
          </p>
        </div>
      </section>

      {/* ✅ Category Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeCategory === category
                ? "bg-[#990e15] text-white shadow-lg"
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"

              }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ✅ News Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-100 dark:bg-gray-900">

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                {/* ✅ News Image */}
                {post.images && post.images.length > 0 ? (
                  <img
                    src={Array.isArray(post.images) ? post.images[0] : JSON.parse(post.images)[0]} // ✅ Ensure images are an array
                    alt={post.title}
                    className="w-full h-56 object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-300 flex items-center justify-center text-gray-500 rounded-t-xl">
                    No Image Available
                  </div>
                )}


                {/* ✅ News Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{post.category}</p>
                  <p className="mt-3 text-gray-700 dark:text-gray-400 text-sm line-clamp-2">{post.content.substring(0, 20)}...</p>


                  {/* ✅ Read More Button */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <Link href={`/news/${post.id}`}>
                      <span className="text-[#990e15] font-semibold hover:underline">
                        Read More →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">No news available for this category.</p>
        )}
      </div>
      <Footer />
    </>
  );
}
