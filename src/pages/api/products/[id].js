import connectMongo from "@/lib/mongodb";
import Product from "@/models/Product";
import { Types } from "mongoose";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log(req.query);
    try {
        console.log('CONNECTING TO MONGO');
        await connectMongo();
        console.log('CONNECTED TO MONGO');

        if (req.method === 'GET') {
            console.log('FETCHING DOCUMENTS');

            // Obtener el limit, offset y el término de búsqueda desde las query params
            const { id } = req.query;

            if (!Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            // Obtener los productos que coinciden con la búsqueda con paginación
            const product = await Product.findById(id).populate('categoryIDs', "name");

            res.json(product);
        } else {
            throw new Error(`Unsupported HTTP method: ${req.method}`);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}