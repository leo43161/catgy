import { DialogProduct } from "@/components/Products/DialogProduct";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useGetProductsQuery } from "@/services/shopApi"; // Debes ajustar tu shopApi para recibir los parámetros
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import SearchBar from "../SearchBar";
import CardProduct from "./CardProduct";

export function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const { data: response, isLoading, error, refetch } = useGetProductsQuery({ limit, offset });

  const products = response?.products;
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
    console.log(product);
    setEditingProduct(product);
    setOpenModal(true);
    setNewProduct(product);
  };

  const handleDeleteProduct = (id) => {
    // Lógica para eliminar producto
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0 text-center md:text-left">Gestión de Productos</h1>
        <Button className="flex items-center gap-2" onClick={() => setOpenModal(true)}>
          <PlusCircle className="w-5 h-5" />
          Añadir Producto
        </Button>
      </div>
      <div className="mb-4">
        <SearchBar></SearchBar>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
        {isLoading ? (<div>Cargando...</div>)
          : error ? (<div>Error al cargar los productos</div>)
            : products?.map((product) => (
              <CardProduct
                product={product}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
              />
            ))}
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

      <DialogProduct
        showDialog={openModal}
        setEditingProduct={setEditingProduct}
        editingProduct={editingProduct}
        handleImageUpload={handleImageUpload}
        setOpenModal={setOpenModal}
        onProductAdded={refetch}
      />
    </div>
  );
}
