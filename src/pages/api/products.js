import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit, startAfter } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const productsRef = collection(db, 'products');
      console.log(productsRef);
      const q = query(productsRef, limit(10));  // Agrega limit y otros parámetros si es necesario
      const querySnapshot = await getDocs(q);

      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
