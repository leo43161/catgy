import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogProduct } from "@/components/Products/DialogProduct";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetProductsQuery } from "@/services/shopApi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function Products({ setProducts }) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 1;
  const offset = (currentPage - 1) * limit;

  const { data: products, isLoading } = useGetProductsQuery();

  console.log(products);

  const totalPages = products ? Math.ceil(products.length / limit) : 1; // Asegúrate de tener el total correcto

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
    setProducts(products.filter((p) => p.id !== id));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Gestión de Productos</h1>
        <Button className="flex items-center gap-2" onClick={() => setOpenModal(true)}>
          <PlusCircle className="w-5 h-5" />
          Añadir Producto
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="flex flex-col justify-between overflow-hidden">
            <div>
              {product.image && (
                <img
                  src={URL.createObjectURL(product.image)}
                  alt={product.name}
                  className="max-w-full h-auto"
                />
              )}
            </div>
            <CardHeader>
              <div className="flex gap-3">
                {/* {product?.categories.map((category) => (
                  <Badge key={category.categoryID}>{category.name}</Badge>
                ))} */}
              </div>
              <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">${product.price}</p>
              <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleView(product.id)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Componente de paginación */}
      {/* <Pagination>
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
      </Pagination> */}

      <DialogProduct
        showDialog={openModal}
        editingProduct={editingProduct}
        handleImageUpload={handleImageUpload}
        setOpenModal={setOpenModal}
      />
    </div>
  );
}
