import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CardTable({ table, handleEditTable, onTableAdded }) {
  // Determinar el color del badge según el estado de la mesa
  const getStatusColor = (status) => {
    switch(status) {
      case 'ocupada': return 'bg-red-500';
      case 'solicitando': return 'bg-yellow-500';
      case 'libre': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`
      w-full 
      ${table.callingAttention ? 'border-2 border-yellow-500' : ''}
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
        <p>Capacidad: {table.capacity} personas</p>
        {table.callingAttention && (
          <div className="text-yellow-600 font-bold mt-2">
            ¡Solicita atención!
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
        <Button 
          variant="secondary" 
          onClick={() => {
            // Lógica para cambiar estado de llamado
            table.callingAttention = !table.callingAttention;
            onTableAdded();
          }}
        >
          {table.callingAttention ? 'Atendida' : 'Llamar'}
        </Button>
      </CardFooter>
    </Card>
  );
}