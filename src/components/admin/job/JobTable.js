// JobTable.js
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal } from "lucide-react";
import { callAPI } from "../../../utils/api";
import TablePagination from "../../shared/TablePagination";

export default function JobTable({ onView, onEdit, onDelete, onAdd }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    callAPI("get", "/jobs")
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch((error) => console.error("Failed to fetch jobs:", error));
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const results = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.job_type.toLowerCase().includes(q) ||
        job.status.toLowerCase().includes(q)
    );
    setFilteredJobs(results);
    setCurrentPage(1);
  }, [searchQuery, jobs]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex justify-end pl-40">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#990e15]">Manage Job Listings</h2>
          <Button onClick={onAdd} className="bg-[#990e15] hover:bg-[#7d0d12] text-white px-4 py-2 rounded-md text-sm shadow">
            <Plus size={16} className="mr-2" /> Add New Job
          </Button>
        </div>


        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Job Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-gray-50">
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "Published"
                            ? "success"
                            : job.status === "Draft"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="z-50 w-40">
                          <DropdownMenuItem
                            onClick={() => onView(job)}
                            className="cursor-pointer bg-white px-3 py-2 hover:bg-gray-100"
                          >
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(job)}
                            className="cursor-pointer bg-white px-3 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(job.id)}
                            className="cursor-pointer bg-white px-3 py-2 text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No jobs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
