import mongoose from 'mongoose';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import { useCreateProductMutation, useGetCategoriesAllQuery, useUploadImageMutation, useUpdateProductMutation } from "@/services/shopApi";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  price: Yup.number().required('El precio es obligatorio').positive('El precio debe ser un número positivo'),
  description: Yup.string(),
  stock: Yup.number().required('El stock es obligatorio').integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
  imagen: Yup.mixed().required("La imagen es obligatoria"),
  offer: Yup.number().min(0, 'La oferta debe ser un número positivo o cero'),
  categories: Yup.array().min(1, 'Debes seleccionar al menos una categoría'),
});

export const DialogProduct = ({
  editingProduct,
  handleImageUpload,
  showDialog,
  setOpenModal,
  setEditingProduct,
  onProductAdded
}) => {
  const { data: categoriesAll, isLoading, error } = useGetCategoriesAllQuery();
  const user = useSelector(state => state.userReducer.value.user);

  const [uploadImage] = useUploadImageMutation();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

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

  const submitHandler = async (values, { setSubmitting, resetForm }) => {
    try {
      let imageUrl = values.imagen;
      //Verifica si existe una imagen para subir
      /* if (values.imagen instanceof File) {
        const formData = new FormData();
        formData.append("image", values.imagen);
        const uploadRes = await uploadImage(formData).unwrap();
        if (uploadRes.success) {
          imageUrl = uploadRes.name;
        } else {
          throw new Error("No se pudo subir la imagen");
        }
      } */
      //Formatea las categorias
      const categoriesObjectIds = values.categories.map(categoryId => new mongoose.Types.ObjectId(categoryId));
      //Preparar los datos
      const productData = {
        ...values,
        imagen: imageUrl,
        categoryIDs: categoriesObjectIds,
        createdBy: user ? new mongoose.Types.ObjectId(user.id) : null,
        id: editingProduct._id
      };
      /* console.log(productData);
      return; */
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
          validationSchema={validationSchema}
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
                      {!isLoading && categoriesAll?.map((category, idx) => (
                        <DropdownMenuCheckboxItem
                          key={idx}
                          checked={initialValues.categories.includes(category._id)}
                          onCheckedChange={(checked) => {
                            //Se prepara para cargar las categorias en el producto que se vas a subir
                            const updatedCategories = checked
                              ? [...initialValues.categories, category._id]
                              : initialValues.categories.filter((id) => id !== category._id);
                            //Se sube en el formulario y en el producto a cargar
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
