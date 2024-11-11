import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '../ui/button'

export default function CardCategory({category}) {
    return (
        <Card key={category.id}>
            <CardHeader>
                <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardFooter>
                <Button onClick={() => handleEditCategory(category)} className="mr-2">Edit</Button>
                <Button onClick={() => handleDeleteCategory(category.id)} variant="destructive">Delete</Button>
            </CardFooter>
        </Card>
    )
}
