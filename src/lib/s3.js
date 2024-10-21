import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadImageToS3 = async (file, type = "products") => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${type}/${Date.now()}-${file.name}`, // Define el path en S3
        Body: file,
        ContentType: file.type,
        ACL: 'public-read', // Permitir acceso público al objeto
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // URL pública de la imagen
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Failed to upload image");
    }
};
