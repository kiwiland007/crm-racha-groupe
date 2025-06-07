import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Task } from "@/contexts/TaskContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/utils/cn";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères",
  }),
  description: z.string().min(1, {
    message: "La description est requise",
  }),
  assignedTo: z.string({
    required_error: "Veuillez sélectionner un assigné",
  }),
  priority: z.string({
    required_error: "Veuillez sélectionner une priorité",
  }),
  category: z.string({
    required_error: "Veuillez sélectionner une catégorie",
  }),
  dueDate: z.string({
    required_error: "Veuillez sélectionner une date d'échéance",
  }),
  notes: z.string().optional(),
});

type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (data: TaskFormValues & { contactId?: number; contactName?: string; status: string }) => void;
  contactId?: number;
  contactName?: string;
  editTask?: Task;
  onEditTask?: (data: TaskFormValues & { contactId?: number; contactName?: string; status: string }) => void;
}

export function TaskForm({
  open,
  onOpenChange,
  onAddTask,
  contactId,
  contactName,
  editTask,
  onEditTask
}: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      category: "other",
      dueDate: "",
      notes: "",
    },
  });

  // Effet pour remplir le formulaire quand editTask change
  useEffect(() => {
    if (editTask) {
      form.reset({
        title: editTask.title || "",
        description: editTask.description || "",
        assignedTo: editTask.assignedTo || "",
        priority: editTask.priority || "medium",
        category: editTask.category || "other",
        dueDate: editTask.dueDate || "",
        notes: editTask.notes || "",
      });
      if (editTask.dueDate) {
        setSelectedDate(new Date(editTask.dueDate));
      }
    } else {
      form.reset({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
        category: "other",
        dueDate: "",
        notes: "",
      });
      setSelectedDate(undefined);
    }
  }, [editTask, form]);

  function onSubmit(data: TaskFormValues) {
    setIsSubmitting(true);

    try {
      const taskData = {
        ...data,
        contactId,
        contactName,
        status: editTask?.status || 'todo'
      };

      if (editTask && onEditTask) {
        // Modifier la tâche existante
        onEditTask(taskData);
      } else {
        // Ajouter une nouvelle tâche
        onAddTask(taskData);
      }

      // Réinitialiser le formulaire
      form.reset();
      setSelectedDate(undefined);

      // Fermer le dialogue
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur de tâche:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      form.setValue("dueDate", format(date, "yyyy-MM-dd"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editTask ? "Modifier la tâche" : "Créer une tâche"}
            {contactName && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                pour {contactName}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {editTask
              ? "Modifiez les informations de la tâche."
              : "Remplissez les informations pour créer une nouvelle tâche."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la tâche</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Appeler le client, Préparer démonstration..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez la tâche en détail..."
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigné à</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un assigné" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hamid">Hamid Alaoui</SelectItem>
                        <SelectItem value="sara">Sara Bennani</SelectItem>
                        <SelectItem value="karim">Karim Idrissi</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="call">Appel téléphonique</SelectItem>
                        <SelectItem value="meeting">Réunion</SelectItem>
                        <SelectItem value="follow_up">Suivi client</SelectItem>
                        <SelectItem value="demo">Démonstration</SelectItem>
                        <SelectItem value="proposal">Proposition commerciale</SelectItem>
                        <SelectItem value="installation">Installation</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'échéance</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            {selectedDate ? (
                              format(selectedDate, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes supplémentaires sur la tâche..."
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting
                  ? (editTask ? "Modification en cours..." : "Création en cours...")
                  : (editTask ? "Modifier la tâche" : "Créer la tâche")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
