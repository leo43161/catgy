import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Pencil, Trash2 } from "lucide-react";
export default function CardProduct({ product, handleEditProduct, handleView, handleDeleteProduct }) {
    const URLImage = process.env.NEXT_PUBLIC_S3_URL_IMG;
    return (
        <Card key={product._id} className="flex flex-col justify-between overflow-hidden">
            <div className="mb-5">
                {product.imagen && (
                    <img
                        src={`${URLImage}products/${product.imagen}`}
                        alt={product.name}
                        className="object-cover w-full h-48 object-center"
                    />
                )}
            </div>
            <CardHeader className="py-0 mb-4">
                <div className="flex gap-3">
                    {product?.categoryIDs?.map((category, idx) => (
                        <Badge key={idx}>{category.name}</Badge>
                    ))}
                </div>
                <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-bold">${product.price}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleView(product.id)}>
                    <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
