import connectMongo from "@/lib/mongodb"; // Asegúrate de que el archivo mongoose.js esté configurado correctamente
import Product from "@/models/Product"; // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto
import Category from "@/models/Category"; // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto
import User from "@/models/User"; // Asegúrate de que la ruta sea correcta según la estructura de tu proyecto

export default async function handler(req, res) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    if (req.method === 'POST') {
      console.log('CREATING DOCUMENT');
      const createdUser = await Product.create(req.body);
      console.log('CREATED DOCUMENT');
      res.json({ createdUser });
    } else if (req.method === 'GET') {
      console.log('FETCHING DOCUMENTS');
      const fetchedProduct = await Product.find({})
      .populate('categoryIDs') // Aquí puedes especificar los campos que deseas seleccionar de la colección "categories"
      .exec();
      const fetchedCategory = await Category.find({});
      const fetchedUser = await User.find({})
      console.log('FETCHED DOCUMENTS');
      console.log(fetchedProduct);
      console.log(fetchedCategory);
      console.log(fetchedUser);
      res.json(fetchedProduct);
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}