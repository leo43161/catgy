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
import { useGetCategoriesAllQuery } from "@/services/shopApi";
import { useSelector } from "react-redux";
import { uploadImageToS3 } from "@/lib/s3";

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
}) => {
  const { data: categoriesAll, isLoading } = useGetCategoriesAllQuery();
  const user = useSelector(state => state.userReducer.value.user);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    offer: 0,
    image: null, // imageURL: Aquí se manejará el URL después de la carga
    categories: [],
    active: true,
    visible: true,
    createdBy: "id", // Placeholder: esto debe estar basado en el usuario actual autenticado
  });

  const submitAddHandler = (values) => {
    console.log(process);
    console.log(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID);
    console.log(process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY);
    console.log(process.env.NEXT_PUBLIC_AWS_REGION);
    console.log(process.env.NEXT_PUBLIC_S3_BUCKET_NAME);
    console.log("Producto enviado: ", values);
    uploadImageToS3(values.image, "products");
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
