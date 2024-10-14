import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import { useRegisterUserMutation } from "@/services/userApi";
//Error msj
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const validationSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio'),
  email: Yup.string().email('Debe ser un correo válido').required('El correo es obligatorio'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
  phoneNumber: Yup.string().matches(/^\d{10}$/, 'El número de teléfono debe tener 10 dígitos').required('El número de teléfono es obligatorio'),
  role: Yup.string().oneOf(['vendedor', 'administrador', 'cliente'], 'Rol no válido').required('El rol es obligatorio'),
});

export const DialogUser = ({
  showDialog,
  setOpenModal,
}) => {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [errorMsj, setErrorMsj] = useState("");

  const initialUser = {
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "cliente", // Valor por defecto
  };

  const submitHandler = async (values) => {
    try {
      await registerUser(values).unwrap();
      setOpenModal(false); // Cerrar modal si el registro es exitoso
    } catch (error) {
      console.log
      setErrorMsj(error.data.error ? error.data.error : "Error al registrar usuario, intentalo de nuevo en unos minutos");
      console.error("Error al registrar usuario: ", error);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialUser}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
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
                <Label htmlFor="phoneNumber" className="text-right">Teléfono</Label>
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
              {errorMsj && <div>
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorMsj}
                  </AlertDescription>
                </Alert>
              </div>}

            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Agregar Usuario"}
            </Button>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
