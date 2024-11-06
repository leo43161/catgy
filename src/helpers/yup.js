import * as Yup from 'yup';

export const validationSchemaProducts = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    price: Yup.number().required('El precio es obligatorio').positive('El precio debe ser un número positivo'),
    description: Yup.string(),
    stock: Yup.number().required('El stock es obligatorio').integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),
    imagen: Yup.mixed().required("La imagen es obligatoria"),
    offer: Yup.number().min(0, 'La oferta debe ser un número positivo o cero'),
    categories: Yup.array().min(1, 'Debes seleccionar al menos una categoría'),
});