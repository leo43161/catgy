import { MongoClient, ServerApiVersion  } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
console.log(process.env.MONGODB_URI);
const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    // En el modo de desarrollo, usa una variable global para que el valor
    // se mantenga entre las recargas de los módulos provocadas por HMR.
    if (!global._mongoClient) {
        global._mongoClient = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }
    client = global._mongoClient;
} else {
    // En producción, crea un nuevo cliente sin utilizar variables globales.
    client = new MongoClient(uri);
}

// Exporta un cliente MongoClient con ámbito a nivel de módulo. De esta manera,
// se puede compartir el cliente en diferentes funciones sin crear múltiples conexiones.
clientPromise = client.connect().db("catgy2024");
console.log(await clientPromise);

export default clientPromise;
