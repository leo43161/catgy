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


export const DialogProduct = ({
  editingProduct,
  handleImageUpload,
  showDialog,
  setOpenModal,
  setEditingProduct,
  onProductAdded
}) => {
  const { data: categoriesAll, isLoading, error } = useGetCategoriesAllQuery();
  console.log(categoriesAll);
  const user = useSelector(state => state.userReducer.value.user);

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
    if (editingProduct) {
      setSelectedCategories(initialValues.categories);
    }
  }, [editingProduct]);

  const submitHandler = async (values, { setSubmitting, resetForm }) => {
    try {
      let imageUrl = values.imagen;
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
        alert(`Producto ${editingProduct ? "actualizado" : "agregado"} exitosamente`);
        onProductAdded();
        resetForm();
        setOpenModal(false);
        setEditingProduct(false);
      } else {
        throw new Error("No se pudo procesar la solicitud");
      }
    } catch (error) {
      console.error("Error en el proceso del producto:", error);
      alert("Ocurrió un error durante el proceso");
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
                  <Label htmlFor="offer" className="text-right">Oferta</Label>
                  <Field id="offer" name="offer" type="number" as={Input} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imagen" className="text-right">Imagen</Label>
                  <Input id="imagen" name="imagen" type="file" onChange={(e) => {
                    handleImageUpload(e); // Función para cargar la imagen
                    setFieldValue("imagen", e.currentTarget.files[0]);
                  }} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categories" className="text-right">Categorías</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="col-span-3" variant="outline">Seleccionar categoría</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <DropdownMenuLabel>Categorías</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* Aqui anda mal, si me agrega las categorias que selecciona pero en el renderizado no me aparece renderizado el tilde que indica que la seleccione, aunque si se agregue en el array y se agrega en la Base de datos */}
                      {!isLoading && categoriesAll?.map((category, idx) => (
                        <DropdownMenuCheckboxItem
                          key={idx}
                          checked={selectedCategories.includes(category._id)}
                          onCheckedChange={(checked) => {
                            //Se prepara para cargar las categorias en el producto que se vas a subir
                            const updatedCategories = checked
                              ? [...selectedCategories, category._id]
                              : selectedCategories.filter((id) => id !== category._id);
                            //Se sube en el formulario y en el producto a cargar
                            setSelectedCategories(updatedCategories);
                            setFieldValue("categories", updatedCategories);
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
