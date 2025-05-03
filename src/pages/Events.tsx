
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  Search,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";

export default function Events() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: 1,
      title: "Salon Digital Tech",
      startDate: "12 Mai 2025",
      endDate: "15 Mai 2025",
      time: "09:00 - 18:00",
      location: "Centre de Conférences, Casablanca",
      client: "MarketPro Digital",
      status: "planifié",
      teamMembers: 3,
      equipments: 8,
      description: "Installation de stands interactifs pour le salon annuel Digital Tech."
    },
    {
      id: 2,
      title: "Installation écrans Foire Internationale",
      startDate: "15 Mai 2025",
      endDate: "15 Mai 2025",
      time: "08:00 - 14:00",
      location: "Foire Internationale, Rabat",
      client: "Event Masters",
      status: "confirmé",
      teamMembers: 2,
      equipments: 4,
      description: "Installation de 4 écrans tactiles pour le stand d'Event Masters."
    },
    {
      id: 3,
      title: "Réunion commerciale MarketPro",
      startDate: "18 Mai 2025",
      endDate: "18 Mai 2025",
      time: "10:00 - 12:00",
      location: "Siège MarketPro, Casablanca",
      client: "MarketPro Digital",
      status: "planifié",
      teamMembers: 1,
      equipments: 0,
      description: "Présentation des nouvelles offres et services."
    },
    {
      id: 4,
      title: "Salon de l'Agriculture",
      startDate: "22 Mai 2025",
      endDate: "26 Mai 2025",
      time: "09:00 - 19:00",
      location: "Parc des Expositions, Meknès",
      client: "AgriTech Solutions",
      status: "en attente",
      teamMembers: 4,
      equipments: 12,
      description: "Installation complète du stand AgriTech avec bornes et écrans tactiles."
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmé":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmé
          </Badge>
        );
      case "planifié":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Planifié
          </Badge>
        );
      case "en attente":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            En attente
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

  const handleAddEvent = () => {
    toast.info("Fonctionnalité à venir", {
      description: "La création d'évènements sera bientôt disponible."
    });
  };

  return (
    <Layout title="Évènements">
      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>
          <div className="mt-2 md:mt-0">
            <Button className="gap-2" onClick={handleAddEvent}>
              <Plus size={16} />
              Nouvel évènement
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher un évènement..."
              className="pl-8 bg-white border-gray-200 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              Filtres
            </Button>
          </div>
        </div>

        <TabsContent value="list">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Assigner techniciens</DropdownMenuItem>
                        <DropdownMenuItem>Réserver matériel</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Annuler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {event.startDate === event.endDate
                          ? event.startDate
                          : `${event.startDate} - ${event.endDate}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{event.teamMembers} techniciens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{event.equipments} équipements</span>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Évènements du jour</CardTitle>
                <CardDescription>3 Mai 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Évènement</TableHead>
                      <TableHead className="hidden md:table-cell">Client</TableHead>
                      <TableHead className="hidden md:table-cell">Équipe</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div>
                          <div className="font-medium">Formation tactile ZHC</div>
                          <div className="text-sm text-muted-foreground">10:00 - 12:00</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">ZHC Corporate</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex -space-x-2">
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="bg-racha-blue/10 text-racha-blue text-xs">
                              HA
                            </AvatarFallback>
                          </Avatar>
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="bg-racha-blue/10 text-racha-blue text-xs">
                              IM
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Confirmé
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <div>
                          <div className="font-medium">Maintenance bornes MediTech</div>
                          <div className="text-sm text-muted-foreground">14:30 - 16:00</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">MediTech Labs</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex -space-x-2">
                          <Avatar className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="bg-racha-blue/10 text-racha-blue text-xs">
                              SA
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Planifié
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
