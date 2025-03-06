import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CardTable({ table, handleEditTable, onTableAdded }) {
  // Determinar el color del badge según el estado de la mesa
  const getStatusColor = (status) => {
    switch (status) {
      case 'ocupada': return 'bg-red-500';
      case 'solicitando': return 'bg-yellow-500';
      case 'libre': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  const getAlertColor = (status) => {
    switch (status) {
      case 'cuenta': return {
        style: 'border-2 border-green-500',
        text: 'text-green-600',
        alert: 'Estan solicitando la cuenta'
      };
      case 'llamado': return {
        style: 'border-2 border-yellow-500',
        text: 'text-yellow-600',
        alert: 'Necesotan atencion'
      };
      default: return {
        style: '',
        alert: null
      };
    }
  };

  return (
    <Card className={`
      w-full 
      ${getAlertColor(table.alert).style}
    `}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Mesa {table.name}
          <Badge
            className={`${getStatusColor(table.status)} text-white`}
          >
            {table.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Información adicional de la mesa */}
        {getAlertColor(table.alert).alert && (
          <div className={`${getAlertColor(table.alert).text} font-bold mt-2`}>
            {getAlertColor(table.alert).alert}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handleEditTable(table)}
        >
          Ver Pedido
        </Button>
      </CardFooter>
    </Card>
  );
}