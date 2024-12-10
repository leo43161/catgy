import connectMongo from "@/lib/mongodb"; // Asegúrate de que el archivo mongoose.js esté configurado correctamente
import Category from "@/models/Category"; // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    if (req.method === 'POST') {
      console.log('CREATING DOCUMENT');
      try {
        const createdCategory = await Category.create(req.body);
        res.status(201).json({
          success: true,
          message: "Category created successfully",
          createdCategory,
        });
      } catch (error) {
        console.error('Error creating product:', error);
        // Verificar si el error es de validación
        if (error.name === 'ValidationError') {
          res.status(400).json({
            success: false,
            message: "Validation failed. Check your input.",
            errors: error.errors, // Detalle específico del error de validación
          });
        } else {
          // Otros errores inesperados
          res.status(500).json({
            success: false,
            message: "Failed to create product due to a server error.",
            error: error.message,
          });
        }
      }
    } else if (req.method === 'GET') {
      console.log('FETCHING DOCUMENTS');
      // Obtener el limit y el offset desde las query params
      const { limit, offset, type, search } = req.query;

      // Crear el objeto de búsqueda
      const query = search ? { name: { $regex: search, $options: 'i' }, active: true } : { active: true }; // 'i' hace que la búsqueda sea insensible a mayúsculas
      if (type !== "all") {
        // Contar el número total de productos para calcular el total de páginas
        const totalCategories = await Category.countDocuments(query);

        const fetchedCategories = await Category.find(query)
          .skip(parseInt(offset))
          .limit(parseInt(limit))
          .exec();
        console.log('FETCHED DOCUMENTS');
        res.json({ categories: fetchedCategories, total: totalCategories });
      } else {
        const fetchedCategories = await Category.find(query);
        res.json(fetchedCategories);
      }
    } else if (req.method === 'PUT') {
      const { state, id, value } = req.query;
      if (state && id && value) {
        const updatedCategory = await Category.findByIdAndUpdate(id, { $set: { [state]: value } });
        res.json(updatedCategory);
        res.status(201).json({
          success: true,
          message: "Category updated successfully",
          updatedCategory,
        });
        return;
      }

      try {
        const createdCategory = await Category.findByIdAndUpdate(req.body.id, req.body);
        console.log('Category updated successfully:', createdCategory);

        res.status(201).json({
          success: true,
          message: "Category updated successfully",
          createdCategory,
        });
      } catch (error) {
        console.error('Error updated product:', error);

        // Verificar si el error es de validación
        if (error.name === 'ValidationError') {
          res.status(400).json({
            success: false,
            message: "Validation failed. Check your input.",
            errors: error.errors, // Detalle específico del error de validación
          });
        } else {
          // Otros errores inesperados
          res.status(500).json({
            success: false,
            message: "Failed to updated product due to a server error.",
            error: error.message,
          });
        }
      }
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}