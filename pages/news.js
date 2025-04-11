import { useEffect, useState } from "react";
import Link from "next/link";
import SEOComponent from "../src/hooks/useSEO";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { callAPI } from "../src/utils/api"; // ✅ Import callAPI

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await callAPI("get", "/news"); // ✅ Updated API call
        console.log("✅ API Response:", data);
        setNews(data);
        setFilteredNews(data);

        const uniqueCategories = ["All", ...new Set(data.map((post) => post.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("❌ Error fetching news:", error);
      } finally {
      }
    };
    fetchNews();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    filterNews(searchQuery, category);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterNews(query, activeCategory);
  };

  const filterNews = (query, category) => {
    let filtered = news;
  
    if (category !== "All") {
      filtered = filtered.filter((post) => post.category === category);
    }
  
    if (query) {
      const lowerQuery = query.toLowerCase();
  
      filtered = filtered.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(lowerQuery);
        const categoryMatch = post.category.toLowerCase().includes(lowerQuery);
  
        const updatedDate = new Date(post.updated_at);
        const dateFormatted = updatedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const monthYear = updatedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
  
        const dateMatch =
          dateFormatted.toLowerCase().includes(lowerQuery) ||
          monthYear.toLowerCase().includes(lowerQuery) ||
          updatedDate.getFullYear().toString().includes(lowerQuery) ||
          (updatedDate.getMonth() + 1).toString().padStart(2, "0") === lowerQuery || // Month number
          updatedDate.getDate().toString().padStart(2, "0") === lowerQuery; // Day number
  
        return titleMatch || categoryMatch || dateMatch;
      });
    }
  
    setFilteredNews(filtered);
  };
  

  return (
    <>
      <SEOComponent />
      <Header />

      {/* ✅ Hero Section */}
      <section className="relative bg-[#990e15] dark:bg-[#770a10] text-white py-20 text-center"> 
        <div className="max-w-3xl mt-10 mx-auto">
          <h1 className="text-5xl font-extrabold">What's New</h1>
          <p className="mt-4 text-lg text-gray-200">
            Stay updated with the latest insights, trends, and updates from Avida.
          </p>
        </div>
      </section>

      {/* ✅ Search & Filter Section */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search by title, date or category..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#990e15] dark:bg-gray-800 dark:text-white"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-[#990e15] text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ News Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-100 dark:bg-gray-900">
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((post) => {
  const postImage = Array.isArray(post.images)
    ? post.images[0]
    : JSON.parse(post.images || "[]")[0];

  return (
    <Link key={post.id} href={`/news/${post.id}`} passHref>
      <div className="cursor-pointer bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
        {/* ✅ News Image */}
        {postImage ? (
          <img
            src={postImage}
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{post.category}</p>
          <p className="mt-3 text-gray-700 dark:text-gray-400 text-sm line-clamp-2">
            {post.content.substring(0, 100)}...
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(post.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-[#990e15] font-semibold hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
})}

          </div>
        ) : (
          <p className="text-center text-gray-600 mt-10">No news available for this category.</p>
        )}
      </div>

      <Footer />
    </>
  );
}
