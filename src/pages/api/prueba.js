import connectMongo from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from 'mongoose';

export default async function handler(req, res) {
    try {
        console.log("CONNECTING TO MONGO");
        console.log(process.env.NEXT_PUBLIC_MONGO_URI);
        if (mongoose.connection.readyState === 0) {
            try {
                await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI, {
                    dbName: 'catgy2024',
                });
                console.log('MongoDB connected');
            } catch (error) {
                console.error('MongoDB connection error:', error);
                throw new Error('Failed to connect to MongoDB');
            }
        } else {
            console.log('MongoDB already connected');
        }

        console.log("CONNECTED TO MONGO");

        if (req.method === "GET") {
            console.log("FETCHING DOCUMENTS");
            const { limit, offset, search } = req.query;
            const query = search
                ? { name: { $regex: search, $options: "i" }, active: true }
                : { active: true };
            const totalProducts = await Product.countDocuments(query);
            const fetchedProducts = await Product.find(query)
                .populate("categoryIDs", "name")
                .skip(parseInt(offset) || 0)
                .limit(parseInt(limit) || 10)
                .exec();
            return res.status(200).json({ products: fetchedProducts, total: totalProducts });
        }

        if (req.method === "POST") {
            console.log("CREATING PRODUCT");
            const createdProduct = await Product.create(req.body);
            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                createdProduct,
            });
        }

        if (req.method === "PUT") {
            const { state, id, value } = req.query;
            if (state && id && value) {
                const updatedProduct = await Product.findByIdAndUpdate(id, { $set: { [state]: value } }, { new: true });
                return res.status(200).json({
                    success: true,
                    message: "Product updated successfully",
                    updatedProduct,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Missing query parameters for update.",
                });
            }
        }

        res.status(405).json({
            success: false,
            message: `Method ${req.method} not allowed.`,
        });
    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message || "Unknown error.",
        });
    }
}
