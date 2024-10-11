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
      const fetchedCategories = await Category.find({});
      console.log('FETCHED DOCUMENTS');
      console.log(fetchedCategories);
      res.json(fetchedCategories);
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}