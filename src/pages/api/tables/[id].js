import connectMongo from "@/lib/mongodb";
import Table from "@/models/Table";
import { Types } from "mongoose";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    try {
        console.log('CONNECTING TO MONGO');
        await connectMongo();
        console.log('CONNECTED TO MONGO');

        if (req.method === 'PUT') {
            console.log('FETCHING DOCUMENTS');

            // Obtener el limit, offset y el término de búsqueda desde las query params
            const { id } = req.query;

            if (!Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            // Editar en la base de datos el atributo de la tabla alerta
            await Table.updateOne({ _id: id }, { $set: { alerta: req.body.alerta } });

            return res.status(201).json({ message: 'Cambiado exitosamente' });
        } else {
            throw new Error(`Unsupported HTTP method: ${req.method}`);
        }
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
}