import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateProductStateMutation } from "@/services/shopApi";
import { useToast } from "@/hooks/use-toast"
import { Eye, Pencil, Trash2, EyeClosed } from "lucide-react";
import { useState } from "react";

export default function CardProduct({ product, handleEditProduct, onProductAdded }) {
    const [openModal, setOpenModal] = useState(false);
    const [stateUpdate, setStateUpdate] = useState(null);
    const [updateStateProduct] = useUpdateProductStateMutation();
    const URLImage = process.env.NEXT_PUBLIC_S3_URL_IMG;
    const { toast } = useToast()
    const handleModalState = async (state) => {
        const productData = {
            ...product,
            [state]: !product[state],
        };
        console.log(productData);
        setStateUpdate(state);
        setOpenModal(true);
    }
    const handleStateProduct = async (state) => {
        try {
            await updateStateProduct({ state, id: product._id, value: !product[state] }).unwrap();
            onProductAdded();
            toast({
                title: `Producto ${stateUpdate === "active" ? "eliminado" : product[state] ? "desactivado" : "activado"} exitosamente`,
                description: `${product.name} fue ${stateUpdate === "active" ? "eliminado" : product[state] ? "desactivado" : "activado"} exitosamente`,
                className: 'bg-primary text-primary-foreground border-primary-foreground',
            })
        } catch (error) {
            console.log(error)
            toast({
                variant: "destructive",
                title: `Error al ${stateUpdate === "active" ? "eliminado" : product[state] ? "desactivado" : "activado"} el producto`,
                description: `No se pudo ${stateUpdate === "activar" ? "eliminar" : product[state] ? "desactivar" : "activar"} el producto, intentelo de nuevo en unos minutos`,
            })
        }
    };
    return (
        <>
            <Card key={product._id} className="flex flex-col justify-between overflow-hidden">
                <div className="mb-5">
                    {product.imagen && (
                        <img
                            src={`${URLImage}products/${product.imagen}`}
                            alt={product.name}
                            className="object-cover w-full h-48 object-center"
                        />
                    )}
                </div>
                <div className="py-0 mb-2 px-6">
                    <div className="flex gap-3">
                        {product?.categoryIDs?.map((category, idx) => (
                            <Badge className="text-sm" key={idx}>{category.name}</Badge>
                        ))}
                    </div>
                </div>
                <CardHeader className="py-0 mb-4">
                    <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-4">{product.description}</p>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-bold">${product.price}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="" size="icon" onClick={() => handleEditProduct(product)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant={product.visible ? "secondary" : "outline"} size="icon" onClick={() => handleModalState("visible")}>
                        {product.visible ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleModalState("active")}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </CardFooter>
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
                        <AlertDialogAction onClick={() => handleStateProduct(stateUpdate)}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
