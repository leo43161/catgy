import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ProductManagement({ products, setProducts, categories }) {
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", image: null, categories: [] })
  const [editingProduct, setEditingProduct] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct({ ...newProduct, [name]: value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setNewProduct({ ...newProduct, image: file })
  }

  const handleCategoryChange = (value) => {
    setNewProduct({ ...newProduct, categories: [...newProduct.categories, value] })
  }

  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct, id: Date.now() }])
    setNewProduct({ name: "", description: "", price: "", stock: "", image: null, categories: [] })
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setNewProduct(product)
  }

  const handleUpdateProduct = () => {
    setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)))
    setEditingProduct(null)
    setNewProduct({ name: "", description: "", price: "", stock: "", image: null, categories: [] })
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Categories: {product.categories.join(", ")}</p>
              {product.image && <img src={URL.createObjectURL(product.image)} alt={product.name} className="mt-2 max-w-full h-auto" />}
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleEditProduct(product)} className="mr-2">Edit</Button>
              <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Product</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={newProduct.name} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" value={newProduct.description} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input id="price" name="price" type="number" value={newProduct.price} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Stock</Label>
              <Input id="stock" name="stock" type="number" value={newProduct.stock} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">Image</Label>
              <Input id="image" name="image" type="file" onChange={handleImageUpload} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categories" className="text-right">Categories</Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}