import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateCategoryStateMutation } from "@/services/shopApi";
import { useToast } from "@/hooks/use-toast"
import { Eye, Pencil, Trash2, EyeClosed } from "lucide-react";
import { useState } from "react";

export default function CardCategory({
    category,
    handleEditCategory,
    onCategoryAdded
}) {
    const [openModal, setOpenModal] = useState(false);
    const [stateUpdate, setStateUpdate] = useState(null);
    const [updateStateCategory] = useUpdateCategoryStateMutation();
    //const URLImage = process.env.NEXT_PUBLIC_S3_URL_IMG;
    const { toast } = useToast();
    const handleModalState = async (state) => {
        const productData = {
            ...category,
            [state]: !category[state],
        };
        console.log(productData);
        setStateUpdate(state);
        setOpenModal(true);
    }
    const handleStateCategory = async (state) => {
        try {
            await updateStateCategory({ state, id: category._id, value: !category[state] }).unwrap();
            onCategoryAdded();
            toast({
                title: `Producto ${stateUpdate === "active" ? "eliminado" : category[state] ? "desactivado" : "activado"} exitosamente`,
                description: `${category.name} fue ${stateUpdate === "active" ? "eliminado" : category[state] ? "desactivado" : "activado"} exitosamente`,
                className: 'bg-primary text-primary-foreground border-primary-foreground',
            })
        } catch (error) {
            console.log(error)
            toast({
                variant: "destructive",
                title: `Error al ${stateUpdate === "active" ? "eliminado" : category[state] ? "desactivado" : "activado"} el producto`,
                description: `No se pudo ${stateUpdate === "activar" ? "eliminar" : category[state] ? "desactivar" : "activar"} el producto, intentelo de nuevo en unos minutos`,
            })
        }
    };
    return (
        <>
            <Card key={category.id}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-bold">{category.name}</h1>
                        </div>
                        <div className="flex justify-between items-center flex-col gap-3">
                            <Button variant="" size="icon" onClick={() => handleEditCategory(category)}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant={category.visible ? "secondary" : "outline"} size="icon" onClick={() => handleModalState("visible")}>
                                {category.visible ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleModalState("active")}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={openModal} onOpenChange={setOpenModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Estas seguro de {stateUpdate === "active" ? "eliminar" : "activar"} el producto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion no se puede deshacer una vez realizada
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancelar
                        </Button>
                        <AlertDialogAction onClick={() => handleStateCategory(stateUpdate)}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
