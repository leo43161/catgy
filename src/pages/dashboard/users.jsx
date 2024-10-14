import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogProduct } from "@/components/Products/DialogProduct";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useGetUsersQuery } from "@/services/usersApi";
import { DialogUser } from "@/components/Users/DialogUser";

export default function Products() {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const offset = (currentPage - 1) * limit;

    const { data: response, isLoading } = useGetUsersQuery({ limit, offset });

    const users = response?.users;
    const total = response?.total;
    const totalPages = total ? Math.ceil(total / limit) : 1;

    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", image: null, categories: [] });
    const [editingProduct, setEditingProduct] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setNewProduct({ ...newProduct, image: file });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct(product);
        setOpenModal(true);
    };

    const handleDeleteProduct = (id) => {
        // Lógica para eliminar producto
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Gestión de Usuarios</h1>
                <Button className="flex items-center gap-2" onClick={() => setOpenModal(true)}>
                    <PlusCircle className="w-5 h-5" />
                    Añadir Usuario
                </Button>
            </div>
            <div className="bg-zinc-800 border rounded-lg mb-5">
                <Table >
                    <TableHeader>
                        <TableRow >
                            <TableHead className="text-zinc-100 font-bold">Nombre</TableHead>
                            <TableHead className="text-zinc-100 font-bold">Rol</TableHead>
                            <TableHead className="text-zinc-100 font-bold">E-mail</TableHead>
                            <TableHead className="text-right text-zinc-100 font-bold">Editar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-zinc-100">
                        {users?.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell className="font-medium w-1/6">{product.name}</TableCell>
                                <TableCell className="w-1/6">{product.role}</TableCell>
                                <TableCell className="w-1/6">{product.email}</TableCell>
                                <TableCell className="d-flex justify-end w-1/6">
                                    <div className="flex gap-3 justify-end">
                                        {/* <Button variant="secondary" size="icon">
                                            <Pencil className="w-4 h-4" />
                                            </Button> */}
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="secondary" size="icon">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <Pagination>
                <PaginationContent>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages).keys()].map((number) => (
                        <PaginationItem key={number}>
                            <PaginationLink
                                href="#"
                                onClick={() => handlePageChange(number + 1)}
                                isActive={currentPage === number + 1}
                            >
                                {number + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </PaginationContent>
            </Pagination>

            <DialogUser
                showDialog={openModal}
                editingUser={editingProduct}
                setOpenModal={setOpenModal}
            />
        </div>
    );
}
