// Importa las funciones correctas de Firebase
import { ref, child, get } from "firebase/database";
import { database } from "@/lib/firebase"; // Asegúrate de exportar `database` correctamente desde tu archivo firebase.js

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Referencia a la raíz de la base de datos
      const dbRef = ref(database);

      // Obtenemos los productos desde Firebase Realtime Database
      const snapshot = await get(child(dbRef, `products`));

      if (snapshot.exists()) {
        const products = snapshot.val();
        console.log(products);
        res.status(200).json(products);
      } else {
        res.status(404).json({ error: 'No data available' });
      }

    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
