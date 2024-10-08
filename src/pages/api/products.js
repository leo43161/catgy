import clientPromise from "@/lib/mongodb"; // Asegúrate de que el archivo mongodb.js esté configurado correctamente
import mongoose from 'mongoose';
import Product from "@/models/Product"; // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Espera a que la conexión a MongoDB esté lista
      await clientPromise;

      // Obtén todos los productos de la base de datos
      const products = await Product.find({}); // Aquí puedes agregar filtros si es necesario
      console.log(products)
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
