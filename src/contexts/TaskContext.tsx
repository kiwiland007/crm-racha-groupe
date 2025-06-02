import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface Task {
  id: number;
  title: string;
  description: string;
  contactId?: number;
  contactName?: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  category: 'call' | 'meeting' | 'follow_up' | 'demo' | 'proposal' | 'installation' | 'maintenance' | 'other';
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getTaskById: (id: number) => Task | undefined;
  getTasksByContact: (contactId: number) => Task[];
  getTasksByStatus: (status: string) => Task[];
  getTasksByAssignee: (assignedTo: string) => Task[];
  markTaskCompleted: (id: number) => void;
  searchTasks: (query: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

// Tâches par défaut pour la démonstration
const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Appeler Imane Alaoui",
    description: "Faire un suivi sur l'intérêt pour les écrans tactiles",
    contactId: 1,
    contactName: "Imane Alaoui",
    assignedTo: "sara",
    priority: "high",
    status: "todo",
    dueDate: "2025-06-02",
    category: "call",
    tags: ["suivi", "écrans tactiles"],
    notes: "Client très intéressé, à rappeler rapidement",
    createdAt: "2025-05-31T10:00:00Z",
    updatedAt: "2025-05-31T10:00:00Z"
  },
  {
    id: 2,
    title: "Préparer démonstration pour TechSolutions",
    description: "Organiser une démonstration des bornes interactives",
    contactId: 2,
    contactName: "Mehdi Bensaid",
    assignedTo: "hamid",
    priority: "medium",
    status: "in_progress",
    dueDate: "2025-06-05",
    category: "demo",
    tags: ["démonstration", "bornes"],
    notes: "Prévoir salle de démonstration et matériel",
    createdAt: "2025-05-30T14:30:00Z",
    updatedAt: "2025-05-31T09:15:00Z"
  },
  {
    id: 3,
    title: "Envoyer proposition commerciale",
    description: "Finaliser et envoyer la proposition pour Event Masters",
    contactId: 4,
    contactName: "Youssef Amrani",
    assignedTo: "hamid",
    priority: "high",
    status: "todo",
    dueDate: "2025-06-01",
    category: "proposal",
    tags: ["proposition", "événementiel"],
    notes: "Inclure les services événementiels dans la proposition",
    createdAt: "2025-05-29T16:45:00Z",
    updatedAt: "2025-05-31T08:30:00Z"
  }
];

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const STORAGE_KEY = 'crm_tasks';

  // Charger les tâches depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } else {
        // Si aucune tâche sauvegardée, utiliser les tâches par défaut
        setTasks(defaultTasks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      setTasks(defaultTasks);
    }
  }, []);

  // Sauvegarder les tâches dans localStorage à chaque modification
  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des tâches:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les tâches'
        });
      }
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const now = new Date().toISOString();
    
    const newTask: Task = {
      ...taskData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    setTasks(prev => [newTask, ...prev]);
    
    toast.success("Tâche créée", {
      description: `${taskData.title} a été créée avec succès.`
    });
  };

  const updateTask = (id: number, taskData: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            ...taskData, 
            updatedAt: new Date().toISOString() 
          }
        : task
    ));
    
    toast.success("Tâche modifiée", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (taskToDelete) {
      toast.success("Tâche supprimée", {
        description: `${taskToDelete.title} a été supprimée avec succès.`
      });
    }
  };

  const markTaskCompleted = (id: number) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: 'completed' as const,
            completedAt: now,
            updatedAt: now
          }
        : task
    ));
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.success("Tâche terminée", {
        description: `${task.title} a été marquée comme terminée.`
      });
    }
  };

  const getTaskById = (id: number): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByContact = (contactId: number): Task[] => {
    return tasks.filter(task => task.contactId === contactId);
  };

  const getTasksByStatus = (status: string): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByAssignee = (assignedTo: string): Task[] => {
    return tasks.filter(task => task.assignedTo === assignedTo);
  };

  const searchTasks = (query: string): Task[] => {
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.contactName?.toLowerCase().includes(lowercaseQuery) ||
      task.notes?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value: TaskContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByContact,
    getTasksByStatus,
    getTasksByAssignee,
    markTaskCompleted,
    searchTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
