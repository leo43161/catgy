import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
});

const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

export const uploadImageToS3 = async (file, type = "products") => {
    const image = file.get("image"); // Acceder al archivo de la imagen
    const Body = await image.arrayBuffer();
    const params = {
        Bucket: bucketName,
        Key: `${type}/${Date.now()}-${image.name}`, // Usar el nombre del archivo de la imagen
        Body,
        ContentType: image.type
    };
    try {
        const command = new PutObjectCommand(params);
        const data = await s3Client.send(command);
        return { data };
    } catch (error) {
        console.error("Error uploading to S3:", error);
    }
};

