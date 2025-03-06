import { DialogTable } from "@/components/Tables/ModalTable";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useGetTablesQuery } from "@/services/shopApi"; // Asumo que necesitarás crear este servicio
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import CardTable from "@/components/Tables/CardTable";

export default function Tables() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // Estado para la búsqueda de mesas
  const limit = 8;
  const offset = (currentPage - 1) * limit;

  const { data: response, isLoading, error, refetch } = useGetTablesQuery({ limit, offset, search });

  const tables = response?.tables;
  const total = response?.total;
  const totalPages = total ? Math.ceil(total / limit) : 1;

  const [editingTable, setEditingTable] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleEditTable = (table) => {
    setEditingTable(table);
    setOpenModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1); // Reinicia la paginación al cambiar la búsqueda
    refetch(); // Refresca las mesas
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0 text-center md:text-left">Gestión de Mesas</h1>
        <Button className="flex items-center gap-2" onClick={() => setOpenModal(true)}>
          <PlusCircle className="w-5 h-5" />
          Añadir Mesa
        </Button>
      </div>
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Buscar mesa..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
        {isLoading ? (<div>Cargando mesas...</div>)
          : error ? (<div>Error al cargar las mesas</div>)
            : tables?.map((table) => (
              <CardTable
                table={table}
                handleEditTable={handleEditTable}
                onTableAdded={refetch}
              />
            ))}
      </div>

      {/* Paginación */}
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
            className={`${currentPage === 1 ? "disabled" : ""}`}
          />
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
          <PaginationNext
            className={`${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationContent>
      </Pagination>

      <DialogTable
        showDialog={openModal}
        setEditingTable={setEditingTable}
        editingTable={editingTable}
        setOpenModal={setOpenModal}
        onTableAdded={refetch}
      />
    </div>
  );
}