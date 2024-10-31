import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    if (req.method === 'POST') {
      console.log('Attempting to create product...');
      
      try {
        const createdProduct = await Product.create(req.body);
        console.log('Product created successfully:', createdProduct);
    
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
      // Obtener el limit y el offset desde las query params
      const { limit, offset } = req.query;
      // Contar el número total de productos para calcular el total de páginas
      const totalProducts = await Product.countDocuments();
      // Obtener los productos con paginación
      const fetchedProducts = await Product.find({})
        .populate('categoryIDs', "name")
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .exec();
      res.json({ products: fetchedProducts, total: totalProducts });
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}