// src/components/admin/news/NewsTable.js
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TablePagination from "../../shared/TablePagination";

export default function NewsTable({ news = [], onAdd, onEdit, onDelete, onView }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredNews = news.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(news.length / itemsPerPage));

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-7xl mx-auto">

      {/* Add Button Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#990e15]">Manage News</h2>
        <Button
          onClick={onAdd}
          className="bg-[#990e15] hover:bg-[#7d0d12] text-white px-4 py-2 rounded-md text-sm shadow"
        >
          Add News
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
  {filteredNews.map((item) => (
    <TableRow key={item.id} className="hover:bg-gray-50 relative z-[10]"> {/* 🔧 Add relative/z-index */}
      <TableCell>{item.title}</TableCell>
      <TableCell>{item.category}</TableCell>
      <TableCell>{item.content?.substring(0, 20)}...</TableCell>

      <TableCell>
        {Array.isArray(item.images) && item.images.length > 0 ? (
          <div className="relative z-0">
            <Swiper
              modules={[Navigation]}
              navigation
              slidesPerView={1}
              className="w-28 h-28 z-0"
            >
              {item.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-lg border">
                    <a href={img} target="_blank" rel="noopener noreferrer">
                      <img
                        src={img}
                        alt={`News ${i + 1}`}
                        className="w-24 h-24 object-cover rounded shadow-md"
                        onError={(e) => (e.target.src = "/fallback-image.jpg")}
                      />
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <span className="text-sm text-gray-500">No Images</span>
        )}
      </TableCell>

      <TableCell>{item.created_at?.split("T")[0]}</TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 p-0 flex items-center justify-center bg-white border"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="z-[50] w-44 bg-white border rounded-md shadow-lg"> {/* 🔧 z-index fix */}
            <DropdownMenuItem
              onClick={() => onView(item)}
              className="text-base px-2 py-1 hover:bg-gray-100"
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(item)}
              className="text-base px-2 py-1 hover:bg-gray-100"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="text-base px-2 py-1 text-red-600 hover:bg-red-100"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );

}