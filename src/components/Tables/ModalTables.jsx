import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
  } from "@/components/ui/dialog";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  
  export function DialogTable({ 
    showDialog, 
    setEditingTable, 
    editingTable, 
    setOpenModal, 
    onTableAdded 
  }) {
    // Si no hay mesa seleccionada, no mostrar nada
    if (!editingTable) return null;
  
    // Calcular total de la cuenta
    const total = editingTable.orders?.reduce((acc, order) => 
      acc + (order.price * order.quantity), 0) || 0;
  
    return (
      <Dialog open={showDialog} onOpenChange={() => {
        setOpenModal(false);
        setEditingTable(null);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pedido de Mesa {editingTable.name}</DialogTitle>
            <DialogDescription>
              Detalles del pedido actual
            </DialogDescription>
          </DialogHeader>
  
          <div className="space-y-4">
            {editingTable.orders?.map((order, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {order.name}
                    <span>€{(order.price * order.quantity).toFixed(2)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <p>Cantidad: {order.quantity}</p>
                    <p>Hora de pedido: {order.orderTime}</p>
                  </div>
                  {order.instructions && (
                    <p className="text-sm text-gray-500 mt-2">
                      Instrucciones: {order.instructions}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
  
          <div className="text-right font-bold text-xl mt-4">
            Total: €{total.toFixed(2)}
          </div>
  
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setOpenModal(false);
                setEditingTable(null);
              }}
            >
              Cerrar
            </Button>
            <Button 
              onClick={() => {
                // Lógica para marcar pedido como completado
                editingTable.orders = [];
                onTableAdded();
                setOpenModal(false);
                setEditingTable(null);
              }}
            >
              Marcar como Pagado
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }