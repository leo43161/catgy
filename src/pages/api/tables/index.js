import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import Table from "@/models/Table";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    try {
        console.log('CONNECTING TO MONGO');
        await connectMongo();
        console.log('CONNECTED TO MONGO');

        if (req.method === 'POST') {
            console.log('Attempting to create Table...');
            try {
                const createdTable = await Table.create(req.body);
                res.status(201).json({
                    success: true,
                    message: "Table created successfully",
                    createdTable,
                });
            } catch (error) {
                console.error('Error creating Table:', error);

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
                        message: "Failed to create Table due to a server error.",
                        error: error.message,
                    });
                }
            }
        } else if (req.method === 'GET') {
            console.log('FETCHING DOCUMENTS');

            // Obtener el limit, offset y el término de búsqueda desde las query params
            const { limit, offset, search } = req.query;

            // Crear el objeto de búsqueda
            const query =
                search ? { name: { $regex: search, $options: 'i' }, active: true }
                    :
                    { active: true }; // 'i' hace que la búsqueda sea insensible a mayúsculas

            // Contar el número total de Tableos que coinciden con la búsqueda para calcular el total de páginas
            const totalTables = await Table.countDocuments(query);
            // Obtener los Tableos que coinciden con la búsqueda con paginación
            const fetchedTables = await Table.find(query)
                /* .populate('categoryIDs', "name") */
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .exec();

            res.json({ tables: fetchedTables, total: totalTables });
        } else if (req.method === 'PUT') {
            const { state, id, value } = req.query;
            if (state && id && value) {
                const updatedTable = await Table.findByIdAndUpdate(id, { $set: { [state]: value } });
                res.json(updatedTable);
                res.status(201).json({
                    success: true,
                    message: "Table updated successfully",
                    updatedTable,
                });
                return;
            }

            try {
                const createdTable = await Table.findByIdAndUpdate(req.body.id, req.body);
                console.log('Table updated successfully:', createdTable);

                res.status(201).json({
                    success: true,
                    message: "Table updated successfully",
                    createdTable,
                });
            } catch (error) {
                console.error('Error updated Table:', error);

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
                        message: "Failed to updated Table due to a server error.",
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