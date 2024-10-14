import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  email: Yup.string().email('Por favor, proporciona un correo electrónico válido').required('El correo electrónico es obligatorio'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'Por favor, proporciona un número de teléfono válido').required('El número de teléfono es obligatorio'),
  role: Yup.string().oneOf(['vendedor', 'administrador', 'cliente'], 'Selecciona un rol válido').required('El rol es obligatorio'),
});

export const DialogUser = ({
  editingUser,
  showDialog,
  setOpenModal,
}) => {

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "cliente", // Default role
  });

  const submitAddHandler = (values) => {
    // Lógica para guardar el usuario en MongoDB
    /* console.log("Usuario enviado: ", values); */
  }

  return (
    <Dialog open={showDialog} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={newUser}
          validationSchema={validationSchema}
          onSubmit={submitAddHandler}
        >
          {() => (
            <Form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nombre</Label>
                  <Field id="name" name="name" as={Input} className="col-span-3" />
                  <ErrorMessage name="name" component="div" className="text-red-500" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Correo Electrónico</Label>
                  <Field id="email" name="email" type="email" as={Input} className="col-span-3" />
                  <ErrorMessage name="email" component="div" className="text-red-500" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Contraseña</Label>
                  <Field id="password" name="password" type="password" as={Input} className="col-span-3" />
                  <ErrorMessage name="password" component="div" className="text-red-500" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">Número de Teléfono</Label>
                  <Field id="phoneNumber" name="phoneNumber" as={Input} className="col-span-3" />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Rol</Label>
                  <Field as="select" id="role" name="role" className="col-span-3">
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="text-red-500" />
                </div>
              </div>
              <Button type="submit">
                {editingUser ? "Actualizar Usuario" : "Agregar Usuario"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
