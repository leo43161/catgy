// src/pages/api/upload.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "node:fs";

export const config = {
    api: {
        bodyParser: false, // Desactiva el body parser predeterminado de Next.js
    },
};

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
});

const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
const url = process.env.NEXT_PUBLIC_S3_URL_IMG;

const parseForm = (req) =>
    new Promise((resolve, reject) => {
        const form = formidable();
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { files } = await parseForm(req);
            const image = files.image[0];
            if (image) {
                const fileName = `${Date.now()}-${image.originalFilename}`;
                const Body = fs.readFileSync(image.filepath); // Lee el archivo temporal
                const params = {
                    Bucket: bucketName,
                    Key: `products/${fileName}`,
                    Body,
                    ContentType: image.mimetype,
                };
                try {
                    const command = new PutObjectCommand(params);
                    await s3Client.send(command);
                    res.status(200).json({ success: true, message: "Image uploaded successfully", url:`${url}products/${fileName}` });
                } catch (error) {
                    console.error("Error uploading to S3:", error);
                    res.status(500).json({ success: false, message: "Failed to upload image" });
                }
            } else {
                res.status(400).json({ success: false, message: "No image provided" });
            }
        } catch (error) {
            console.error("Error processing form:", error);
            res.status(500).json({ success: false, message: "Failed to process form" });
        }
    } else {
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
