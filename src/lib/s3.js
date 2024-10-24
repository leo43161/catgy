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
    const image = file.get("image");
    const Body = await image.arrayBuffer();
    const params = {
        Bucket: bucketName,
        Key: `${type}/${Date.now()}-${file.name}`, // Define el path en S3
        Body,
        ContentType: file.type
    };
    console.log(params)
    try {
        const command = new PutObjectCommand(params);
        console.log(command);
        const data = await s3Client.send(command);
        console.log(data);
        // Generar la URL pública manualmente
        /* const url = `https://${bucketName}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${params.Key}`; */
        return { data }; // URL pública de la imagen
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Failed to upload image");
    }
};
