import connectMongo from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";

export default async function handler(req, res) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    if (req.method === 'POST') {
      console.log('CREATING DOCUMENT');
      const createdProduct = await Product.create(req.body);
      console.log('CREATED DOCUMENT');
      res.json({ createdProduct });
    } else if (req.method === 'GET') {
      console.log('FETCHING DOCUMENTS');
      // Obtener el limit y el offset desde las query params
      const { limit, offset } = req.query;
      // Contar el número total de productos para calcular el total de páginas
      const totalProducts = await Product.countDocuments();
      // Obtener los productos con paginación
      const fetchedCategory = await Category.find({});
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