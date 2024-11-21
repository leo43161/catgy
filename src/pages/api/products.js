import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Categories from "@/models/Category";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    if (req.method === 'POST') {
      console.log('Attempting to create product...');
      try {
        const createdProduct = await Product.create(req.body);
        res.status(201).json({
          success: true,
          message: "Product created successfully",
          createdProduct,
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

      // Obtener el limit, offset y el término de búsqueda desde las query params
      const { limit, offset, search } = req.query;

      // Crear el objeto de búsqueda
      const query = search ? { name: { $regex: search, $options: 'i' }, active: true } : { active: true }; // 'i' hace que la búsqueda sea insensible a mayúsculas

      // Contar el número total de productos que coinciden con la búsqueda para calcular el total de páginas
      const totalProducts = await Product.countDocuments(query);
      await Categories.find({});
      // Obtener los productos que coinciden con la búsqueda con paginación
      const fetchedProducts = await Product.find(query)
        .populate('categoryIDs', "name")
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .exec();

      res.json({ products: fetchedProducts, total: totalProducts });
    } else if (req.method === 'PUT') {
      const { state, id, value } = req.query;
      if (state && id && value) {
        const updatedProduct = await Product.findByIdAndUpdate(id, { $set: { [state]: value } });
        res.json(updatedProduct);
        res.status(201).json({
          success: true,
          message: "Product updated successfully",
          updatedProduct,
        });
        return;
      }

      try {
        const createdProduct = await Product.findByIdAndUpdate(req.body.id, req.body);
        console.log('Product updated successfully:', createdProduct);

        res.status(201).json({
          success: true,
          message: "Product updated successfully",
          createdProduct,
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