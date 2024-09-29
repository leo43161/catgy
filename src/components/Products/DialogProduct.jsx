import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const DialogProduct = ({
    newProduct,
    editingProduct,
    categories,
    handleInputChange,
    handleImageUpload,
    handleCategoryChange,
    handleAddProduct,
    handleUpdateProduct,
    showDialog,
    setOpenModal // Agregar función para cambiar el estado de apertura
}) => {
    return (
        <Dialog open={showDialog} onOpenChange={setOpenModal}> {/* Manejar el cierre con onOpenChange */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nombre</Label>
                        <Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Descripción</Label>
                        <Textarea id="description" name="description" value={newProduct.description} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Precio</Label>
                        <Input id="price" name="price" type="number" value={newProduct.price} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">Stock</Label>
                        <Input id="stock" name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">Imagen</Label>
                        <Input id="image" name="image" type="file" onChange={handleImageUpload} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categories" className="text-right">Categorías</Label>
                        <Select onValueChange={handleCategoryChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                    {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
