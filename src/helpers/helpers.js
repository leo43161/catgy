
import imageCompression from 'browser-image-compression';

export const verifyUserLogged = async () => {
    try {
        const response = await fetch('/api/users/login', {
            method: 'GET',
            credentials: 'include' // para incluir cookies automáticamente
        });
        if (response.status === 200) {
            const userLogged = await response.json();
            return userLogged; // devuelve el usuario logueado si existe
        } else {
            return null; // indica que el usuario no está logueado
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        return null;
    }
};

export const compressImage = async (image) => {
    try {
        // Opciones de compresión
        const options = {
            maxSizeMB: 0.7,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        // Comprime la imagen
        const compressedBlob = await imageCompression(image, options);
        const compressedImage = new File([compressedBlob], image.name, {
            type: image.type,
            lastModified: Date.now(),
        });;
        console.log(`Tamaño de la imagen comprimida: ${compressedImage.size / 1024 / 1024} MB`);
        console.log(compressedImage);
        if (compressedImage) {
            return compressedImage;
        } else {
            console.error("Error al comprimir la imagen");
            return null;
        }
    } catch (error) {
        console.error("Error al comprimir o subir la imagen:", error);
        return null;
    }
}