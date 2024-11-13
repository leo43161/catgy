import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Yup from 'yup';
import { useCreateCategoryMutation, useUpdateCategoryMutation/* , useUploadImageMutation */ } from "@/services/shopApi"
import { ErrorMessage, Field, Form, Formik } from 'formik';
import mongoose from 'mongoose';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
//import { compressImage } from "@/helpers/helpers";

const validationSchemaCategory = Yup.object().shape({ name: Yup.string().required('El nombre es obligatorio') });

export const DialogCategory = ({
    editingCategory,
    showDialog,
    setOpenModal,
    setEditingCategory,
    onCategoryAdded
}) => {
    const user = useSelector(state => state.userReducer.value.user);
    const { toast } = useToast()

    //const [uploadImage] = useUploadImageMutation();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();

    //Aplica los valores iniciales en caso de edición o creación de un producto
    const initialValues = editingCategory
        ? {
            name: editingCategory.name,
            //imagen: editingCategory.imagen || null,
            active: editingCategory.active,
            visible: editingCategory.visible,
            createdBy: editingCategory.createdBy || user ? new mongoose.Types.ObjectId(user.id) : null,
        }
        : {
            name: "",
            //imagen: null,
            active: true,
            visible: true,
            createdBy: user ? new mongoose.Types.ObjectId(user.id) : null,
        };

    const handleBackButton = () => {
        if (showDialog) {
            setOpenModal(false); // Cierra el diálogo si está abierto
            window.history.pushState(null, ''); // Añade una nueva entrada al historial para "cancelar" la navegación
        }
    };

    useEffect(() => {
        if (showDialog) {
            window.history.pushState(null, ''); // Añade una entrada al historial para manejar el botón de "Atrás"
            window.addEventListener('popstate', handleBackButton);
        }
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [showDialog]);

    const submitHandler = async (values, { setSubmitting, resetForm }) => {
        try {
            /* let imageUrl = values.imagen;
            console.log(values)
            //Verifica si existe una imagen para subir
            if (values.imagen instanceof File) {
              console.log(values.imagen)
              const imageCompress = await compressImage(values.imagen);
              const formData = new FormData();
              formData.append("image", imageCompress);
              const uploadRes = await uploadImage(formData).unwrap();
              if (uploadRes.success) {
                imageUrl = uploadRes.name;
              } else {
                throw new Error("No se pudo subir la imagen");
              }
            }
            //Formatea las categorias
            const categoriesObjectIds = selectedCategories.map(categoryId => new mongoose.Types.ObjectId(categoryId)); */
            //Preparar los datos
            const categoryData = {
                ...values,
                //imagen: imageUrl,
                createdBy: user ? new mongoose.Types.ObjectId(user.id) : null,
                id: !!editingCategory && editingCategory._id
            };
            //Envia la peticion
            let response;
            if (editingCategory) {
                response = await updateCategory(categoryData).unwrap();
            } else {
                response = await createCategory(categoryData).unwrap();
            }
            //Respuesta
            if (response.success) {
                toast({
                    title: `Categoria ${editingCategory ? "actualizada" : "agregada"} exitosamente`,
                    description: `${values.name} fue ${editingCategory ? "actualizado" : "agregado"} exitosamente`,
                    className: 'bg-primary text-primary-foreground border-primary-foreground',
                })
                onCategoryAdded();
                resetForm();
                setOpenModal(false);
                setEditingCategory(false);
            } else {
                toast({
                    variant: "destructive",
                    title: `Error al ${editingCategory ? "actualizar" : "agregar"} la categoria`,
                    description: `No se pudo ${editingCategory ? "actualizar" : "agregar"} la categoria`,
                })
                throw new Error("No se pudo procesar la solicitud");
            }
        } catch (error) {
            console.error("Error en el proceso del producto:", error);
            toast({
                variant: "destructive",
                title: `Error al ${editingCategory ? "actualizar" : "agregar"} la categoria`,
                description: `No se pudo ${editingCategory ? "actualizar" : "agregar"} la categoria`,
            })
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <Dialog
            open={showDialog}
            onOpenChange={(isOpen) => {
                setOpenModal(isOpen);
                if (!isOpen) {
                    setEditingCategory(null); // Restablece el producto de edición al cerrar
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingCategory ? "Editar Categoría" : "Agregar Nueva Categoría"}</DialogTitle>
                </DialogHeader>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchemaCategory}
                    onSubmit={submitHandler}
                    enableReinitialize // Habilitar reinicialización para cargar valores al editar
                >
                    {({ setFieldValue, values, isSubmitting }) => (
                        <Form className="mt-3">
                            <div className="">
                                {/* Visibilidad */}
                                <div className="flex items-center mb-3">
                                    <Checkbox
                                        name="visible"
                                        id="visible"
                                        className="mr-2"
                                        defaultChecked={initialValues.visible}
                                        onClick={(e) => setFieldValue("visible", !(e.target.ariaChecked === "true"))}
                                    />
                                    <Label htmlFor="visible" className="font-medium">Producto visible</Label>
                                </div>

                                {/* Nombre del producto */}
                                <div className="flex flex-col mb-3">
                                    <Label htmlFor="name" className="font-medium mb-2">Nombre</Label>
                                    <Field
                                        id="name"
                                        name="name"
                                        as={Input}
                                        placeholder="Ingrese el nombre del producto"
                                        className="mt-1"
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                                {/* Botones */}
                                {/* Botones */}
                                <div className="flex justify-between pt-4 space-x-4">
                                    <Button type="submit" disabled={isSubmitting} className="flex items-center justify-center">
                                        {isSubmitting ? (
                                            <div className="loader">Cargando...</div>
                                        ) : (
                                            editingCategory ? "Actualizar Categoria" : "Agregar Categoria"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}
