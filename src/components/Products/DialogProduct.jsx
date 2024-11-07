import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { validationSchemaProducts } from '@/helpers/yup';
import { useCreateProductMutation, useGetCategoriesAllQuery, useUpdateProductMutation, useUploadImageMutation } from "@/services/shopApi";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import mongoose from 'mongoose';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"



export const DialogProduct = ({
  editingProduct,
  showDialog,
  setOpenModal,
  setEditingProduct,
  onProductAdded
}) => {
  const { data: categoriesAll, isLoading, error } = useGetCategoriesAllQuery();
  const user = useSelector(state => state.userReducer.value.user);
  const { toast } = useToast()

  const [uploadImage] = useUploadImageMutation();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Estado para manejar las categorías seleccionadas
  const [selectedCategories, setSelectedCategories] = useState([]);

  //Aplica los valores iniciales en caso de edición o creación de un producto
  const initialValues = editingProduct
    ? {
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price,
      stock: editingProduct.stock,
      offer: editingProduct.offer,
      imagen: editingProduct.imagen || null,
      categories: editingProduct.categoryIDs.map(category => category._id),
      active: editingProduct.active,
      visible: editingProduct.visible,
      createdBy: editingProduct.createdBy || user ? new mongoose.Types.ObjectId(user.id) : null,
    }
    : {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      offer: 0,
      imagen: null,
      categories: [],
      active: true,
      visible: true,
      createdBy: user ? new mongoose.Types.ObjectId(user.id) : null,
    };

  useEffect(() => {
    console.log(editingProduct);
    if (editingProduct) {
      setSelectedCategories(initialValues.categories);
    }
  }, [editingProduct]);

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
      let imageUrl = values.imagen;
      console.log(values)
      //Verifica si existe una imagen para subir
      if (values.imagen instanceof File) {
        const formData = new FormData();
        formData.append("image", values.imagen);
        const uploadRes = await uploadImage(formData).unwrap();
        if (uploadRes.success) {
          imageUrl = uploadRes.name;
        } else {
          throw new Error("No se pudo subir la imagen");
        }
      }
      //Formatea las categorias
      const categoriesObjectIds = selectedCategories.map(categoryId => new mongoose.Types.ObjectId(categoryId));
      //Preparar los datos
      const productData = {
        ...values,
        imagen: imageUrl,
        categoryIDs: categoriesObjectIds,
        createdBy: user ? new mongoose.Types.ObjectId(user.id) : null,
        id: !!editingProduct && editingProduct._id
      };
      //Envia la peticion
      let response;
      if (editingProduct) {
        response = await updateProduct(productData).unwrap();
      } else {
        response = await createProduct(productData).unwrap();
      }
      //Respuesta
      if (response.success) {
        toast({
          title: `Producto ${editingProduct ? "actualizado" : "agregado"} exitosamente`,
          description: `${values.name} fue ${editingProduct ? "actualizado" : "agregado"} exitosamente`,
        })
        onProductAdded();
        resetForm();
        setOpenModal(false);
        setEditingProduct(false);
      } else {
        toast({
          variant: "destructive",
          title: `Error al ${editingProduct ? "actualizar" : "agregar"} el producto`,
          description: `No se pudo ${editingProduct ? "actualizar" : "agregar"} el producto`,
        })
        throw new Error("No se pudo procesar la solicitud");
      }
    } catch (error) {
      console.error("Error en el proceso del producto:", error);
      toast({
        variant: "destructive",
        title: `Error al ${editingProduct ? "actualizar" : "agregar"} el producto`,
        description: `No se pudo ${editingProduct ? "actualizar" : "agregar"} el producto`,
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
          setEditingProduct(null); // Restablece el producto de edición al cerrar
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemaProducts}
          onSubmit={submitHandler}
          enableReinitialize // Habilitar reinicialización para cargar valores al editar
        >
          {({ setFieldValue, values }) => (
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

                {/* Descripción */}
                <div className="flex flex-col mb-3">
                  <Label htmlFor="description" className="font-medium mb-2">Descripción</Label>
                  <Field
                    id="description"
                    name="description"
                    as={Textarea}
                    placeholder="Descripción del producto"
                    className="mt-1"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Precio */}
                <div className="flex flex-col mb-3">
                  <Label htmlFor="price" className="font-medium mb-2">Precio</Label>
                  <Field
                    id="price"
                    name="price"
                    type="number"
                    as={Input}
                    placeholder="Ej: 1500"
                    className="mt-1"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Stock */}
                <div className="flex flex-col mb-3">
                  <Label htmlFor="stock" className="font-medium mb-2">Stock</Label>
                  <Field
                    id="stock"
                    name="stock"
                    type="number"
                    as={Input}
                    placeholder="Ej: 20"
                    className="mt-1"
                  />
                  <ErrorMessage name="stock" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Oferta */}
                <div className="flex flex-col mb-3">
                  <Label htmlFor="offer" className="font-medium mb-2">Oferta</Label>
                  <Field
                    id="offer"
                    name="offer"
                    type="number"
                    as={Input}
                    placeholder="Descuento en %"
                    className="mt-1"
                  />
                  <ErrorMessage name="offer" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Imagen */}
                <div className="flex flex-col mb-3">
                  <Label htmlFor="imagen" className="font-medium mb-2">Imagen</Label>
                  <Input
                    id="imagen"
                    name="imagen"
                    type="file"
                    onChange={(e) => setFieldValue("imagen", e.currentTarget.files[0])}
                    className="mt-1"
                  />
                </div>

                {/* Categorías */}
                <div className="flex flex-col mb-3">
                  <Label htmlFor="categories" className="font-medium mb-2">Categorías</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full mt-1" variant="outline">Seleccionar categoría</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Categorías</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {!isLoading && categoriesAll?.map((category, idx) => (
                        <DropdownMenuCheckboxItem
                          key={idx}
                          checked={selectedCategories.includes(category._id)}
                          onCheckedChange={(checked) => {
                            const updatedCategories = checked
                              ? [...selectedCategories, category._id]
                              : selectedCategories.filter((id) => id !== category._id);
                            setSelectedCategories(updatedCategories);
                            setFieldValue("categories", updatedCategories);
                          }}
                        >
                          {category.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <ErrorMessage name="categories" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Botones */}
                <div className="flex justify-between pt-4 space-x-4">
                  <Button type="submit" className="">
                    {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
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
  );
};
