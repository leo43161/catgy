import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import { useGetCategoriesQuery } from "@/services/shopApi";

const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    price: Yup.number().required('El precio es obligatorio').positive('El precio debe ser un número positivo'),
    stock: Yup.number().required('El stock es obligatorio').integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
    image: Yup.mixed().required("La imagen es obligatoria"),
    categories: Yup.array().min(1, 'Debes seleccionar al menos una categoría'),
});

export const DialogProduct = ({
    editingProduct,
    handleImageUpload,
    showDialog,
    setOpenModal,
}) => {
    const { data: categoriesAll, isLoading } = useGetCategoriesQuery();
    console.log(categoriesAll)

    const [newProduct, setNewProduct] = useState({
        productID: "", // Este se genera automáticamente al guardar el producto
        name: "",
        description: "",
        price: "",
        stock: "", // Si decides usar stock, asegúrate de que también esté en Firebase
        image: null, // imageURL: Aquí deberás subir la imagen a Firebase Storage y guardar la URL
        categories: [] // categoryIDs: Aquí deberías almacenar los IDs de las categorías, no los nombres
    });

    const submitAddHandler = () => {
        /* Manejo del submit para cargar un producto a firebase */
    }

    return (
        <Dialog open={showDialog} onOpenChange={setOpenModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
                </DialogHeader>
                <Formik
                    initialValues={newProduct}
                    validationSchema={validationSchema}
                    onSubmit={editingProduct ? null/* handleUpdateProduct */ : submitAddHandler}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Nombre</Label>
                                    <Field id="name" name="name" as={Input} className="col-span-3" />
                                    <ErrorMessage name="name" component="div" className="text-red-500" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Descripción</Label>
                                    <Field id="description" name="description" as={Textarea} className="col-span-3" />
                                    <ErrorMessage name="description" component="div" className="text-red-500" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="price" className="text-right">Precio</Label>
                                    <Field id="price" name="price" type="number" as={Input} className="col-span-3" />
                                    <ErrorMessage name="price" component="div" className="text-red-500" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="stock" className="text-right">Stock</Label>
                                    <Field id="stock" name="stock" type="number" as={Input} className="col-span-3" />
                                    <ErrorMessage name="stock" component="div" className="text-red-500" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="image" className="text-right">Imagen</Label>
                                    <Input id="image" name="image" type="file" onChange={(e) => {
                                        handleImageUpload(e);
                                        setFieldValue("image", e.currentTarget.files[0]);
                                    }} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="categories" className="text-right">Categorías</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="col-span-3" variant="outline">Seleccionar categoria</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {categoriesAll.map((category) => (
                                                <DropdownMenuCheckboxItem
                                                    key={category.categoryID}
                                                    checked={newProduct.categories.includes(category.categoryID)}
                                                    onCheckedChange={(checked) => {
                                                        const updatedCategories = checked
                                                            ? [...newProduct.categories, category.categoryID] // Agrega la categoría si está seleccionada
                                                            : newProduct.categories.filter((id) => id !== category.categoryID); // Elimina la categoría si se deselecciona

                                                        setFieldValue("categories", updatedCategories); // Actualiza el valor en Formik
                                                    }}
                                                >
                                                    {category.name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <ErrorMessage name="categories" component="div" className="text-red-500" />
                                </div>
                            </div>
                            <Button type="submit">
                                {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};
