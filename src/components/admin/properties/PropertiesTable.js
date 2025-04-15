import { useState } from "react";
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
import TablePagination from "../../shared/TablePagination";
import { formatPrice } from "@/utils/formatPrice";

export default function PropertiesTable({ properties, onDelete, onUpdateStatus, onView, onEdit, onAdd }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const paginatedProperties = properties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.max(1, Math.ceil(properties.length / itemsPerPage));

    return (
        <div className="flex justify-end pl-40">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-7xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-[#990e15]">Manage Properties</h2>
                    <Button onClick={onAdd} className="bg-[#990e15] hover:bg-[#7d0d12] text-white px-4 py-2 rounded-md text-sm shadow">Add New</Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property Name</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedProperties.length > 0 ? (
                                paginatedProperties.map((property) => (
                                    <TableRow key={property.id} className="hover:bg-gray-50">
                                        <TableCell>{property.property_name}</TableCell>
                                        <TableCell>{property.first_name} {property.last_name}</TableCell>
                                        <TableCell>{formatPrice(property.price)}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                property.status === 'approved' ? 'success'
                                                    : property.status === 'pending' ? 'warning'
                                                        : 'destructive'
                                            }>
                                                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        Actions ▼
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="start"
                                                    className="z-50 w-40 bg-white border border-gray-200 rounded-md shadow-lg"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => onView(property)}
                                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        View
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onEdit(property)}
                                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onUpdateStatus(property.id, 'approved')}
                                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Approve
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onUpdateStatus(property.id, 'rejected')}
                                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                                    >
                                                        Reject
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(property.id)}
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
                                    <TableCell colSpan={5}>
                                        No properties found.
                                    </TableCell>
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
