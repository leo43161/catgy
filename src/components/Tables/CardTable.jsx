import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CardTable({ table, handleEditTable, onTableAdded }) {
  // Determinar el color del badge según el estado de la mesa
  const getStatusColor = (status) => {
    switch (status) {
      case 'ocupada': return 'bg-green-200 text-green-800';
      case 'solicitando': return 'bg-yellow-500';
      case 'libre': return 'bg-gray-200 text-gray-800';
      case 'reservada': return 'bg-purple-200 text-purple-800';
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
        alert: 'Necesitan atencion'
      };
      default: return {
        style: '',
        alert: null
      };
    }
  };

  const pendingItems = [
    { name: "Pizza", quantity: 2 },
    { name: "Pasta", quantity: 1 }
  ];

  return (
    <Card className={`
      w-full border-2 border-gray-300 dark:border-white
      ${getAlertColor(table.alert).style}
      flex flex-col justify-between
    `}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Mesa {table.name}
          <Badge
            className={`${getStatusColor(table.status)} capitalize`}
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
        {table.status !== "libre" && (
          <>
            <div className="flex items-center text-sm mb-3">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {/* <span>{table.time} {table.duration && `(${table.duration})`}</span> */}
              <span>19:45 (25 min)</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="">Clientes:</span>
                <span className="font-medium">
                  {/* {table.customers} personas */}
                  4 personas
                  </span>
              </div>

              {table.status !== "reservada" && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="">Pedidos:</span>
                    <span className="font-medium">
                      {/* {table.orders} pedidos */}
                      2 pedidos
                      </span>
                  </div>

                  {table.lastOrderTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Última orden:</span>
                      <span className="font-medium">
                        Hace 10 min
                        {/* Hace {table.lastOrderTime} */}
                        </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {pendingItems.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs">Pendientes:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pendingItems.map((item, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          {item.quantity} × {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {/* ${table.total.toLocaleString()} */}
                      ${4000}
                      </p>
                    <p className="text-xs">Total parcial</p>
                  </div>
                </div>
              </div>
            )}

            {table.status === "reservada" && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm italic text-center">
                  {/* Reservada para las {table.time} */}
                  Reservada para las 20:30
                </p>
              </div>
            )}
          </>
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