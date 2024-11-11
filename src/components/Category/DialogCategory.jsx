import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export const DialogCategory = ({
    showDialog,
    setEditingCategory,
    editingCategory,
    setOpenModal,
    onProductAdded
}) => {

    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingCategory ? "Editar Categoría" : "Agregar Nueva Categoría"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nombre</Label>
                        <Input id="name" name="name" value={newCategory.name} onChange={handleInputChange} className="col-span-3" />
                    </div>
                </div>
                <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                    {editingCategory ? "Actualizar Categoría" : "Agregar Categoría"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
