import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogCategory } from "@/components/Category/DialogCategory"

export function Category({ categories, setCategories, products }) {
    const [newCategory, setNewCategory] = useState({ name: "" })
    const [editingCategory, setEditingCategory] = useState(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewCategory({ ...newCategory, [name]: value })
    }

    const handleAddCategory = () => {
        setCategories([...categories, { ...newCategory, id: Date.now() }])
        setNewCategory({ name: "" })
    }

    const handleEditCategory = (category) => {
        setEditingCategory(category)
        setNewCategory(category)
    }

    const handleUpdateCategory = () => {
        setCategories(categories.map((c) => (c.id === editingCategory.id ? newCategory : c)))
        setEditingCategory(null)
        setNewCategory({ name: "" })
    }

    const handleDeleteCategory = (id) => {
        setCategories(categories.filter((c) => c.id !== id))
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Gestión de Categorias</h1>
                <DialogCategory
                    handleCategories={{
                        newCategory,
                        handleInputChange,
                        handleAddCategory,
                        handleUpdateCategory
                    }}
                    editingCategory={editingCategory}
                >
                    <Button className="flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" />
                        Añadir Categoría
                    </Button>
                </DialogCategory>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <Card key={category.id}>
                        <CardHeader>
                            <CardTitle>{category.name}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <Button onClick={() => handleEditCategory(category)} className="mr-2">Edit</Button>
                            <Button onClick={() => handleDeleteCategory(category.id)} variant="destructive">Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>


        </div>
    )
}
