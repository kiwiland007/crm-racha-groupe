import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Users, UserCheck, UserX } from "lucide-react";
import { TECHNICIANS } from "@/contexts/EventContext";

interface TechnicianAssignmentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventDate: string;
  currentAssignments?: number[];
  onAssign?: (technicianIds: number[]) => void;
}

export function TechnicianAssignment({ 
  open, 
  onOpenChange, 
  eventTitle, 
  eventDate,
  currentAssignments = [],
  onAssign 
}: TechnicianAssignmentProps) {
  const [selectedTechnicians, setSelectedTechnicians] = useState<number[]>(currentAssignments);

  React.useEffect(() => {
    setSelectedTechnicians(currentAssignments);
  }, [currentAssignments, open]);

  const handleTechnicianToggle = (technicianId: number) => {
    setSelectedTechnicians(prev => 
      prev.includes(technicianId)
        ? prev.filter(id => id !== technicianId)
        : [...prev, technicianId]
    );
  };

  const handleAssign = () => {
    if (onAssign) {
      onAssign(selectedTechnicians);
    }
    
    const assignedNames = TECHNICIANS
      .filter(tech => selectedTechnicians.includes(tech.id))
      .map(tech => tech.name)
      .join(", ");

    toast.success("Techniciens assignés", {
      description: `${selectedTechnicians.length} technicien(s) assigné(s) à "${eventTitle}": ${assignedNames}`,
    });

    onOpenChange(false);
  };

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 gap-1">
        <UserCheck size={12} />
        Disponible
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-100 text-red-800 gap-1">
        <UserX size={12} />
        Occupé
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users size={20} />
            Assigner des techniciens
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les techniciens pour l'événement "{eventTitle}" le {eventDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {selectedTechnicians.length} technicien(s) sélectionné(s)
          </div>

          <div className="space-y-3">
            {TECHNICIANS.map((technician) => (
              <div
                key={technician.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedTechnicians.includes(technician.id)
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                } ${!technician.available ? "opacity-60" : ""}`}
              >
                <Checkbox
                  id={`tech-${technician.id}`}
                  checked={selectedTechnicians.includes(technician.id)}
                  onCheckedChange={() => handleTechnicianToggle(technician.id)}
                  disabled={!technician.available}
                />

                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {technician.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {technician.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {technician.email}
                      </p>
                    </div>
                    {getAvailabilityBadge(technician.available)}
                  </div>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {technician.speciality}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedTechnicians.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Techniciens sélectionnés:
              </h4>
              <div className="flex flex-wrap gap-2">
                {TECHNICIANS
                  .filter(tech => selectedTechnicians.includes(tech.id))
                  .map(tech => (
                    <div key={tech.id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                          {tech.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{tech.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleAssign} className="gap-2">
            <UserCheck size={16} />
            Assigner {selectedTechnicians.length} technicien(s)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
