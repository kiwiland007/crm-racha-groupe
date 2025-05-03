
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function RecentContacts() {
  const contacts = [
    {
      id: 1,
      name: "Imane Alaoui",
      company: "MarketPro Digital",
      email: "imane.alaoui@marketpro.ma",
      phone: "06 12 34 56 78",
      type: "client",
      source: "LinkedIn",
    },
    {
      id: 2,
      name: "Mehdi Bensaid",
      company: "TechSolutions Maroc",
      email: "m.bensaid@techsolutions.ma",
      phone: "06 98 76 54 32",
      type: "prospect",
      source: "Facebook Ads",
    },
    {
      id: 3,
      name: "Sarah Mansouri",
      company: "Event Masters",
      email: "sarah@eventmasters.ma",
      phone: "06 55 66 77 88",
      type: "client",
      source: "Site Web",
    },
    {
      id: 4,
      name: "Karim El Fassi",
      company: "MediaVision",
      email: "k.elfassi@mediavision.ma",
      phone: "06 11 22 33 44",
      type: "prospect",
      source: "Instagram",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contacts récents</CardTitle>
        <Button variant="outline" size="sm">
          Voir tous
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="hidden sm:flex h-9 w-9">
                      <AvatarFallback className="bg-racha-blue/10 text-racha-blue">
                        {contact.name.split(" ").map(name => name[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{contact.source}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className={
                      contact.type === "client"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    }
                  >
                    {contact.type === "client" ? "Client" : "Prospect"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button size="icon" variant="ghost">
                      <Phone size={16} />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Mail size={16} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Ajouter une note</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
