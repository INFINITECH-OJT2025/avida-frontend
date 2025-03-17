import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Input } from "../../src/components/ui/input";
import { Button } from "../../src/components/ui/button";
import { Table, TableHead, TableBody, TableRow, TableCell } from "../../src/components/ui/table";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import dynamic from "next/dynamic";

// ✅ Import AdminLayout
import AdminLayout from "../../src/components/layout/AdminLayout";

// ✅ Import SwiperJS for image slider
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

// ✅ Load NewsForm dynamically (prevent SSR issues)
const NewsForm = dynamic(() => import("../../src/components/admin/news/create"), { ssr: false });


// ✅ Import Lightbox2 styles globally
import "lightbox2/dist/css/lightbox.min.css";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  useEffect(() => {
    fetchNews();

    // ✅ Load jQuery and Lightbox2 only on the client-side
    if (typeof window !== "undefined") {
      import("jquery").then(($) => {
        window.$ = window.jQuery = $;
        import("lightbox2").then((lb) => {
          lb.option({
            resizeDuration: 200,
            wrapAround: true,
            albumLabel: "Image %1 of %2",
          });
        });
      });
    }
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Unauthorized! Please login.");
        return;
      }
  
      const response = await axios.get("http://localhost:3000/api/news", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const formattedNews = response.data.map((item) => ({
        ...item,
        images: typeof item.images === "string" ? JSON.parse(item.images) : item.images || [],
      }));
  
      setNews(formattedNews);
    } catch (error) {
      console.error("Error fetching news:", error.response?.data || error.message);
    }
  };
  

  const openModal = (newsItem = null) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const closeModalAndRefresh = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
    fetchNews();
  };

  return (
    <AdminLayout>
      {/* ✅ Ensure proper spacing with `ml-64` to prevent overlap with sidebar */}
      <div className="ml-64 min-h-screen px-6 py-10 ">
        {/* ✅ Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">News & Announcements</h1>
          <Button className="bg-[#990e15] text-white flex items-center gap-2" onClick={() => openModal()}>
            <Plus className="w-4 h-4" /> Add News
          </Button>
        </div>

        {/* ✅ Search Bar */}
        <div className="mb-4">
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* ✅ News Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell className="font-semibold">Title</TableCell>
                <TableCell className="font-semibold">Category</TableCell>
                <TableCell className="font-semibold">Content</TableCell>
                <TableCell className="font-semibold">Images</TableCell>
                <TableCell className="font-semibold">Date</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.content.substring(0, 20)}...</TableCell>

                    {/* ✅ Fix Image Parsing Issue */}
                    <TableCell className="relative w-40 text-center">
  {Array.isArray(item.images) && item.images.length > 0 ? (
    <Swiper
      modules={[Navigation]}
      navigation
      slidesPerView={1}
      spaceBetween={5}
      centeredSlides={true}
      className="w-32 h-32"
    >
      {item.images.map((img, index) => (
        <SwiperSlide key={index}>
          <a href={img} data-lightbox={`news-gallery-${item.id}`} data-title={`Image ${index + 1}`}>
            <img
              src={img}
              alt={`News Image ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg shadow-md border border-gray-300"
              onError={(e) => (e.target.src = "/fallback-image.jpg")}
            />
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <span className="text-gray-500">No Images</span>
  )}
</TableCell>


                    <TableCell>{item.created_at?.split("T")[0] || "N/A"}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openModal(item)}>
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => console.log("Delete")}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>

          </Table>
        </div>
      </div>

      {/* ✅ MODAL FOR NEWS FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white w-[700px] h-[550px] max-w-full p-6 rounded-lg shadow-lg relative overflow-hidden">

            {/* Scrollable Content */}
            <div className="overflow-y-auto h-full pr-4">

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={closeModalAndRefresh}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <h2 className="text-xl font-bold mb-4">{selectedNews ? "Edit News" : "Add News"}</h2>

              {/* ✅ Render NewsForm Component */}
              <NewsForm closeModal={closeModalAndRefresh} selectedNews={selectedNews} />

            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}
