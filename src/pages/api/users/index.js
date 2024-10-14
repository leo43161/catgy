import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    if (req.method === 'POST') {
      console.log('CREATING DOCUMENT');
      const createdUser = await User.create(req.body);
      console.log('CREATED DOCUMENT');
      res.json({ createdUser });
    } else if (req.method === 'GET') {
      console.log('FETCHING DOCUMENTS');
      // Obtener el limit y el offset desde las query params
      const { limit, offset } = req.query;
      // Contar el número total de productos para calcular el total de páginas
      const totalUsers = await User.countDocuments();
      // Obtener los productos con paginación
      const fetchedUsers = await User.find({})
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .exec();
      res.json({ users: fetchedUsers, total: totalUsers });
    } else {
      throw new Error(`Unsupported HTTP method: ${req.method}`);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}