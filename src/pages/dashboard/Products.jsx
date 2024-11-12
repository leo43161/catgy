import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Products } from "../../components/Products/Products"
import { useState } from "react"
import { Category } from "../../components/Category/Category"

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Maneja tus productos y categorias desde de aqui
      </h1>
      <div className="flex justify-center">
        <Tabs defaultValue="account" className="flex flex-col items-center justify-center w-full">
          <TabsList className="h-auto mb-4 md:mb-0">
            <TabsTrigger className="text-2xl" value="account">Productos</TabsTrigger>
            <TabsTrigger className="text-2xl" value="password">Categorias</TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="account">
            <Products />
          </TabsContent>
          <TabsContent className="w-full" value="password">
            <Category
              products={products}
              setCategories={setCategories}
              categories={categories}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
