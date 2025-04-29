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
import TablePagination from "../../shared/TablePagination";

export default function PoliciesTable({ policies = [], onDelete, onView, onEdit, onAdd }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const paginatedPolicies = policies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.max(1, Math.ceil(policies.length / itemsPerPage));

    return (
        <div className="flex justify-end pl-40">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-7xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-[#990e15]">Manage Policies</h2>
                    <Button
                        onClick={onAdd}
                        className="bg-[#990e15] hover:bg-[#7d0d12] text-white px-4 py-2 rounded-md text-sm shadow"
                    >
                        Add New
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Main Title</TableHead>
                                <TableHead>Sub Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedPolicies.length > 0 ? (
                                paginatedPolicies.map((policy) => (
                                    <TableRow key={policy.id} className="hover:bg-gray-50">
                                        <TableCell className="font-semibold">{policy.main_title}</TableCell>
                                        <TableCell>{policy.sub_title || "-"}</TableCell>
                                        <TableCell className="truncate max-w-xs">
                                            {policy.description ? policy.description.slice(0, 50) + "..." : "-"}
                                        </TableCell>

                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="icon">
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="start"
                                                    className="z-50 w-40 bg-white border border-gray-200 rounded-md shadow-lg"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => onView(policy)}
                                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        View
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onEdit(policy)}
                                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(policy.id)}
                                                        className="cursor-pointer px-3 py-2 text-red-600 hover:bg-red-100"
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
                                    <TableCell colSpan={4}>No policies found.</TableCell>
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
