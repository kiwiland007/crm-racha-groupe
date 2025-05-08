
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";

// Données factices pour les factures récentes
const invoices = [
  {
    id: "INV-001",
    client: "Société ABC",
    date: "05/08/2025",
    amount: 15000,
    advanceAmount: 5000,
    status: "Payée",
    paymentMethod: "Virement",
  },
  {
    id: "INV-002",
    client: "Event Pro Services",
    date: "02/08/2025",
    amount: 8500,
    advanceAmount: 3000,
    status: "En attente",
    paymentMethod: "Chèque",
  },
  {
    id: "INV-003",
    client: "Hotel Marrakech",
    date: "29/07/2025",
    amount: 22000,
    advanceAmount: 10000,
    status: "Payée",
    paymentMethod: "Carte bancaire",
  },
];

export function RecentInvoices() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Factures récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant (MAD)</TableHead>
              <TableHead>Avance (MAD)</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount.toLocaleString()} MAD</TableCell>
                <TableCell>{invoice.advanceAmount.toLocaleString()} MAD</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${invoice.status === "Payée" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {invoice.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default RecentInvoices;
