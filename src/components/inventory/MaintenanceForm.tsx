import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wrench, Calendar, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  type: z.enum(["preventive", "corrective", "emergency"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().min(1, "La description est requise"),
  scheduledDate: z.string().min(1, "La date est requise"),
  estimatedDuration: z.string().optional(),
  technician: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Equipment {
  id: number;
  name: string;
  category: string;
  status: string;
  quantity: number;
  location: string;
  lastMaintenance: string;
}

interface MaintenanceFormProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FormValues & { id: number }) => void;
}

export function MaintenanceForm({ equipment, open, onOpenChange, onSave }: MaintenanceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "preventive",
      priority: "medium",
      description: "",
      scheduledDate: "",
      estimatedDuration: "",
      technician: "",
      notes: "",
    },
  });

  // Réinitialiser le formulaire quand l'équipement change
  useEffect(() => {
    if (equipment && open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      form.reset({
        type: "preventive",
        priority: "medium",
        description: `Maintenance préventive pour ${equipment.name}`,
        scheduledDate: tomorrow.toISOString().split('T')[0],
        estimatedDuration: "2h",
        technician: "",
        notes: "",
      });
    }
  }, [equipment, open, form]);

  const onSubmit = (data: FormValues) => {
    if (equipment) {
      onSave({
        ...data,
        id: equipment.id,
      });
      onOpenChange(false);
    }
  };

  if (!equipment) return null;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Faible</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Moyenne</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Élevée</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Planifier une maintenance
          </DialogTitle>
          <DialogDescription>
            Programmer une intervention de maintenance pour {equipment.name}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{equipment.name}</p>
              <p className="text-sm text-gray-600">{equipment.category}</p>
              <p className="text-sm text-gray-600">Emplacement: {equipment.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Dernière maintenance</p>
              <p className="font-medium">{equipment.lastMaintenance}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de maintenance</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="preventive">Préventive</SelectItem>
                        <SelectItem value="corrective">Corrective</SelectItem>
                        <SelectItem value="emergency">Urgence</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de l'intervention</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les travaux à effectuer..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date prévue
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée estimée</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="1h">1 heure</SelectItem>
                        <SelectItem value="2h">2 heures</SelectItem>
                        <SelectItem value="4h">4 heures</SelectItem>
                        <SelectItem value="1j">1 jour</SelectItem>
                        <SelectItem value="2j">2 jours</SelectItem>
                        <SelectItem value="1s">1 semaine</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="technician"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technicien assigné (optionnel)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un technicien" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ahmed.tech">Ahmed - Technicien senior</SelectItem>
                      <SelectItem value="youssef.tech">Youssef - Technicien</SelectItem>
                      <SelectItem value="fatima.tech">Fatima - Spécialiste écrans</SelectItem>
                      <SelectItem value="external">Prestataire externe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes additionnelles (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations complémentaires, pièces nécessaires, etc."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aperçu de la maintenance */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Résumé de la maintenance</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Priorité:</span>
                  {getPriorityBadge(form.watch("priority"))}
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{
                    form.watch("type") === "preventive" ? "Préventive" :
                    form.watch("type") === "corrective" ? "Corrective" : "Urgence"
                  }</span>
                </div>
                {form.watch("scheduledDate") && (
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">
                      {new Date(form.watch("scheduledDate")).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Planifier la maintenance
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
