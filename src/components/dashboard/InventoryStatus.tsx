
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function InventoryStatus() {
  const inventory = [
    {
      id: 1,
      name: "Écran tactile 32\"",
      status: "disponible",
      quantity: 5,
      alert: false,
    },
    {
      id: 2,
      name: "Borne interactive 43\"",
      status: "loué",
      quantity: 0,
      alert: true,
    },
    {
      id: 3,
      name: "Table tactile 55\"",
      status: "disponible",
      quantity: 2,
      alert: true,
    },
    {
      id: 4,
      name: "Écran LED extérieur",
      status: "maintenance",
      quantity: 1,
      alert: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponible":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Disponible
          </Badge>
        );
      case "loué":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Loué
          </Badge>
        );
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Maintenance
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>État de l'inventaire</CardTitle>
        <Button variant="outline" size="sm">
          Gérer l'inventaire
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Équipement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="flex items-center gap-2">
                  {item.name}
                  {item.alert && <AlertCircle className="h-4 w-4 text-amber-500" />}
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
