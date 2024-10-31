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
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import { useCreateProductMutation, useGetCategoriesAllQuery, useUploadImageMutation } from "@/services/shopApi";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  price: Yup.number().required('El precio es obligatorio').positive('El precio debe ser un número positivo'),
  description: Yup.string(), // No es requerido
  stock: Yup.number().required('El stock es obligatorio').integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
  image: Yup.mixed().required("La imagen es obligatoria"),
  offer: Yup.number().min(0, 'La oferta debe ser un número positivo o cero'),
  categories: Yup.array().min(1, 'Debes seleccionar al menos una categoría'),
});

export const DialogProduct = ({
  editingProduct,
  handleImageUpload,
  showDialog,
  setOpenModal,
  onProductAdded
}) => {
  const { data: categoriesAll, isLoading, error } = useGetCategoriesAllQuery();
  const user = useSelector(state => state.userReducer.value.user);
  console.log(user);

  const [uploadImage] = useUploadImageMutation(); // Hook para subir la imagen
  const [createProduct] = useCreateProductMutation(); // Hook para crear producto

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    offer: 0,
    image: null, // imageURL: Aquí se manejará el URL después de la carga
    categories: [],
    active: true,
    visible: true,
    createdBy: user ? new mongoose.Types.ObjectId(user.id) : null, // Placeholder: esto debe estar basado en el usuario actual autenticado
  });

  const submitAddHandler = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log(values);
      // Subir la imagen a S3 usando el hook
      const formData = new FormData();
      formData.append("image", values.image);
      const uploadRes = await uploadImage(formData).unwrap();
      if (uploadRes.success) {
        const imageUrl = uploadRes.url;
        // Convertir cada categoría a ObjectId
        const categoriesObjectIds = values.categories.map(
          categoryId => new mongoose.Types.ObjectId(categoryId)
        );
        const newProductData = {
          ...values,
          image: imageUrl,
          categoryIDs: categoriesObjectIds,
          createdBy: user ? new mongoose.Types.ObjectId(user.id) : null
        };
        // Crear el producto utilizando Redux Toolkit
        console.log(newProductData);
        const productRes = await createProduct(newProductData).unwrap();

        if (productRes.success) {
          alert("Producto agregado exitosamente");
          resetForm();
          setOpenModal(false);
          onProductAdded();
        } else {
          console.error("Error al crear el producto:", productRes);
          alert("No se pudo crear el producto");
        }
      } else {
        console.error("Error al subir la imagen:", uploadRes);
        alert("No se pudo subir la imagen");
      }
    } catch (error) {
      console.error("Error en la creación del producto:", error);
      alert("Ocurrió un error durante el proceso");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={newProduct}
          /* validationSchema={validationSchema} */
          onSubmit={submitAddHandler}
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
                  <Label htmlFor="image" className="text-right">Imagen</Label>
                  <Input id="image" name="image" type="file" onChange={(e) => {
                    handleImageUpload(e); // Función para cargar la imagen
                    setFieldValue("image", e.currentTarget.files[0]);
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
                          checked={newProduct.categories.includes(category._id)}
                          onCheckedChange={(checked) => {
                            //Se prepara para cargar las categorias en el producto que se vas a subir
                            const updatedCategories = checked
                              ? [...newProduct.categories, category._id]
                              : newProduct.categories.filter((id) => id !== category._id);
                            //Se sube en el formulario y en el producto a cargar
                            setFieldValue("categories", updatedCategories);
                            setNewProduct({ ...newProduct, categories: updatedCategories })
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
