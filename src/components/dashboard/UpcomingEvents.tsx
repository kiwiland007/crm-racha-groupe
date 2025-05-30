
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function UpcomingEvents() {
  const navigate = useNavigate();
  const events = [
    {
      id: 1,
      title: "Salon Digital Tech",
      date: "12 Mai 2025",
      location: "Centre de Conférences, Casablanca",
      attendees: 3,
    },
    {
      id: 2,
      title: "Installation écrans Foire Internationale",
      date: "15 Mai 2025",
      location: "Foire Internationale, Rabat",
      attendees: 2,
    },
    {
      id: 3,
      title: "Réunion commerciale MarketPro",
      date: "18 Mai 2025",
      location: "Siège MarketPro, Casablanca",
      attendees: 4,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Évènements à venir</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigate('/events');
            toast.success("Redirection vers les événements");
          }}
        >
          Tous les évènements
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col space-y-3 rounded-lg border p-3"
            >
              <div className="space-y-0.5">
                <h3 className="font-medium">{event.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {event.date}
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  {event.attendees} techniciens assignés
                </div>
                <Button size="sm" variant="outline">
                  Détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
