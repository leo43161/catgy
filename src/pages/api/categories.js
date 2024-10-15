import connectMongo from "@/lib/mongodb"; // Asegúrate de que el archivo mongoose.js esté configurado correctamente
import Category from "@/models/Category"; // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto

export default async function handler(req, res) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    if (req.method === 'POST') {
      console.log('CREATING DOCUMENT');
      const createdUser = await Category.create(req.body);
      console.log('CREATED DOCUMENT');
      res.json({ createdUser });
    } else if (req.method === 'GET') {
      console.log('FETCHING DOCUMENTS');
      // Obtener el limit y el offset desde las query params
      const { limit, offset, type } = req.query;
      if (type !== "all") {
        // Contar el número total de productos para calcular el total de páginas
        const totalCategories = await Category.countDocuments();

        const fetchedCategories = await Category.find({})
          .skip(parseInt(offset))
          .limit(parseInt(limit))
          .exec();
        console.log('FETCHED DOCUMENTS');
        res.json({ fetchedCategories, total: totalCategories });
      } else {
        const fetchedCategories = await Category.find({});
        res.json(fetchedCategories);
      }
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}