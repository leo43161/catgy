import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductManagement } from "./Products"
import { useState } from "react"

export default function index() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Product and Category Management
      </h1>
      <div className="flex justify-center">
        <Tabs defaultValue="account" className="flex flex-col items-center justify-center w-full">
          <TabsList className="h-auto">
            <TabsTrigger className="text-2xl" value="account">Productos</TabsTrigger>
            <TabsTrigger className="text-2xl" value="password">Categorias</TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="account">
            <ProductManagement
              products={products}
              setProducts={setProducts}
              categories={categories}
            />
          </TabsContent>
          <TabsContent className="w-full" value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
