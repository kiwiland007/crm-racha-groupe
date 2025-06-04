
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MoreVertical, Plus, Trash2, UserCog, Phone, RefreshCw, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Définir une interface pour les permissions pour assurer la cohérence
interface UserPermissions {
  contacts: boolean;
  inventory: boolean;
  events: boolean;
  quotes: boolean;
  settings: boolean;
  admin: boolean;
}

// Définir une interface pour l'utilisateur
interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  permissions: UserPermissions;
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  role: z.string(),
  isActive: z.boolean().default(true),
  permissions: z.object({
    contacts: z.boolean().default(false),
    inventory: z.boolean().default(false),
    events: z.boolean().default(false),
    quotes: z.boolean().default(false),
    settings: z.boolean().default(false),
    admin: z.boolean().default(false),
  })
});

type UserFormValues = z.infer<typeof formSchema>;

export function UserManagement() {
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Fonction pour générer un mot de passe sécurisé
  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  // Utilisateurs par défaut
  const defaultUsers: User[] = [
    {
      id: 1,
      fullName: "Ahmed El Mansouri",
      email: "a.elmansouri@example.ma",
      phone: "+212 661 23 45 67",
      role: "admin",
      isActive: true,
      permissions: {
        contacts: true,
        inventory: true,
        events: true,
        quotes: true,
        settings: true,
        admin: true,
      }
    },
    {
      id: 2,
      fullName: "Fatima Benkirane",
      email: "f.benkirane@example.ma",
      phone: "+212 662 34 56 78",
      role: "manager",
      isActive: true,
      permissions: {
        contacts: true,
        inventory: true,
        events: true,
        quotes: true,
        settings: false,
        admin: false,
      }
    },
    {
      id: 3,
      fullName: "Youssef Alami",
      email: "y.alami@example.ma",
      phone: "+212 663 45 67 89",
      role: "commercial",
      isActive: true,
      permissions: {
        contacts: true,
        inventory: false,
        events: true,
        quotes: true,
        settings: false,
        admin: false,
      }
    },
    {
      id: 4,
      fullName: "Sara Zouiten",
      email: "s.zouiten@example.ma",
      phone: "+212 664 56 78 90",
      role: "technicien",
      isActive: true,
      permissions: {
        contacts: false,
        inventory: true,
        events: true,
        quotes: false,
        settings: false,
        admin: false,
      }
    },
  ];

  const [users, setUsers] = useState<User[]>([]);
  const STORAGE_KEY = 'crm_users';

  // Charger les utilisateurs depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEY);
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers);
      } else {
        setUsers(defaultUsers);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));

        // Initialiser les identifiants pour les utilisateurs par défaut
        const defaultCredentials = [
          { email: "a.elmansouri@example.ma", password: "admin123", userId: 1 },
          { email: "f.benkirane@example.ma", password: "manager123", userId: 2 },
          { email: "y.alami@example.ma", password: "commercial123", userId: 3 },
          { email: "s.zouiten@example.ma", password: "tech123", userId: 4 }
        ];

        const existingCredentials = JSON.parse(localStorage.getItem('crm_user_credentials') || '[]');
        if (existingCredentials.length === 0) {
          localStorage.setItem('crm_user_credentials', JSON.stringify(defaultCredentials));
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUsers(defaultUsers);
    }
  }, []);

  // Sauvegarder les utilisateurs dans localStorage à chaque modification
  useEffect(() => {
    if (users.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les utilisateurs'
        });
      }
    }
  }, [users]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "commercial",
      isActive: true,
      permissions: {
        contacts: false,
        inventory: false,
        events: false,
        quotes: false,
        settings: false,
        admin: false,
      }
    },
  });

  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "commercial",
      isActive: true,
      permissions: {
        contacts: false,
        inventory: false,
        events: false,
        quotes: false,
        settings: false,
        admin: false,
      }
    },
  });

  const handleAddUser = (data: UserFormValues) => {
    try {
      // Vérifier si l'email existe déjà
      const emailExists = users.some(user => user.email.toLowerCase() === data.email.toLowerCase());
      if (emailExists) {
        toast.error("Email déjà utilisé", {
          description: "Cet email est déjà associé à un autre utilisateur"
        });
        return;
      }

      // Générer un ID unique basé sur timestamp
      const newId = Date.now();

      // Créer le nouvel utilisateur
      const newUser: User = {
        id: newId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        role: data.role,
        isActive: data.isActive,
        permissions: {
          contacts: data.permissions.contacts,
          inventory: data.permissions.inventory,
          events: data.permissions.events,
          quotes: data.permissions.quotes,
          settings: data.permissions.settings,
          admin: data.permissions.admin,
        }
      };

      // Ajouter l'utilisateur à la liste
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      // Sauvegarder le mot de passe séparément (simulé)
      const userCredentials = {
        email: data.email,
        password: data.password,
        userId: newId
      };

      // Stocker les identifiants de connexion
      const existingCredentials = JSON.parse(localStorage.getItem('crm_user_credentials') || '[]');
      existingCredentials.push(userCredentials);
      localStorage.setItem('crm_user_credentials', JSON.stringify(existingCredentials));

      toast.success("Utilisateur ajouté", {
        description: `${data.fullName} a été ajouté avec succès. Email: ${data.email}, Mot de passe: ${data.password}`
      });

      setOpenAddDialog(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      toast.error("Erreur", {
        description: "Impossible d'ajouter l'utilisateur"
      });
    }
  };

  const handleEditUser = (data: UserFormValues) => {
    if (currentUser) {
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || "",
            role: data.role,
            isActive: data.isActive,
            permissions: {
              contacts: data.permissions.contacts,
              inventory: data.permissions.inventory,
              events: data.permissions.events,
              quotes: data.permissions.quotes,
              settings: data.permissions.settings,
              admin: data.permissions.admin,
            }
          };
        }
        return user;
      });

      setUsers(updatedUsers);

      toast.success("Utilisateur modifié", {
        description: `${data.fullName} a été mis à jour avec succès.`
      });

      setOpenEditDialog(false);
      setCurrentUser(null);
    }
  };

  const handleDeleteUser = () => {
    if (currentUser) {
      try {
        // Supprimer l'utilisateur de la liste
        const updatedUsers = users.filter(user => user.id !== currentUser.id);
        setUsers(updatedUsers);

        // Supprimer les identifiants associés
        const existingCredentials = JSON.parse(localStorage.getItem('crm_user_credentials') || '[]');
        const updatedCredentials = existingCredentials.filter((cred: any) => cred.email !== currentUser.email);
        localStorage.setItem('crm_user_credentials', JSON.stringify(updatedCredentials));

        toast.success("Utilisateur supprimé", {
          description: `${currentUser.fullName} a été supprimé avec succès.`
        });

        setOpenDeleteDialog(false);
        setCurrentUser(null);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        toast.error("Erreur", {
          description: "Impossible de supprimer l'utilisateur"
        });
      }
    }
  };

  const editUserClicked = (user: User) => {
    setCurrentUser(user);
    editForm.reset({
      ...user,
      phone: user.phone || ""
    });
    setOpenEditDialog(true);
  };

  const deleteUserClicked = (user: User) => {
    setCurrentUser(user);
    setOpenDeleteDialog(true);
  };

  const handleResetPassword = (user: User) => {
    try {
      const newPassword = generateSecurePassword();

      // Mettre à jour les identifiants stockés
      const existingCredentials = JSON.parse(localStorage.getItem('crm_user_credentials') || '[]');
      const updatedCredentials = existingCredentials.map((cred: any) => {
        if (cred.email === user.email) {
          return { ...cred, password: newPassword };
        }
        return cred;
      });
      localStorage.setItem('crm_user_credentials', JSON.stringify(updatedCredentials));

      toast.success("Mot de passe réinitialisé", {
        description: `Nouveau mot de passe pour ${user.fullName}: ${newPassword}`,
        duration: 10000,
        action: {
          label: "Copier",
          onClick: () => {
            navigator.clipboard.writeText(newPassword);
            toast.success("Mot de passe copié dans le presse-papiers");
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      toast.error("Erreur", {
        description: "Impossible de réinitialiser le mot de passe"
      });
    }
  };

  const handleRoleChange = (role: string, formContext: any) => {
    // Définir les permissions par défaut en fonction du rôle
    if (role === "admin") {
      formContext.setValue("permissions", {
        contacts: true,
        inventory: true,
        events: true,
        quotes: true,
        settings: true,
        admin: true,
      });
    } else if (role === "manager") {
      formContext.setValue("permissions", {
        contacts: true,
        inventory: true,
        events: true,
        quotes: true,
        settings: false,
        admin: false,
      });
    } else if (role === "commercial") {
      formContext.setValue("permissions", {
        contacts: true,
        inventory: false,
        events: true,
        quotes: true,
        settings: false,
        admin: false,
      });
    } else if (role === "technicien") {
      formContext.setValue("permissions", {
        contacts: false,
        inventory: true,
        events: true,
        quotes: false,
        settings: false,
        admin: false,
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Administrateur</Badge>;
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manager</Badge>;
      case "commercial":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Commercial</Badge>;
      case "technicien":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Technicien</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(name => name[0]).join("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestion des utilisateurs</h2>
        <Button onClick={() => setOpenAddDialog(true)} className="gap-2">
          <Plus size={16} />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Informations de connexion pour les utilisateurs par défaut */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Identifiants de connexion par défaut :</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
          <div>• a.elmansouri@example.ma → admin123</div>
          <div>• f.benkirane@example.ma → manager123</div>
          <div>• y.alami@example.ma → commercial123</div>
          <div>• s.zouiten@example.ma → tech123</div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Téléphone</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="hidden md:table-cell">Statut</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.fullName}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{user.email}</TableCell>
              <TableCell className="hidden md:table-cell">{user.phone}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell className="hidden md:table-cell">
                <Switch
                  checked={user.isActive}
                  onCheckedChange={(checked) => {
                    const updatedUsers = users.map(u => {
                      if (u.id === user.id) {
                        return { ...u, isActive: checked };
                      }
                      return u;
                    });
                    setUsers(updatedUsers);
                  }}
                />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => editUserClicked(user)}>
                      <UserCog className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Réinitialiser mot de passe
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => deleteUserClicked(user)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog pour ajouter un utilisateur */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouvel utilisateur et définissez ses permissions.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.ma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+212 600 00 00 00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Mot de passe
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newPassword = generateSecurePassword();
                          form.setValue("password", newPassword);
                          toast.success("Mot de passe généré", {
                            description: "Un mot de passe sécurisé a été généré automatiquement"
                          });
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        <RefreshCw size={12} className="mr-1" />
                        Générer
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 6 caractères"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleRoleChange(value, form);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="technicien">Technicien</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-8">
                      <div className="space-y-0.5">
                        <FormLabel>Actif</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Permissions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="permissions.contacts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Contacts</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.inventory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Inventaire</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.events"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Évènements</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.quotes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Devis/Factures</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.settings"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Paramètres</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permissions.admin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Administration</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Ajouter l'utilisateur</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier un utilisateur */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier un utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations et les permissions de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.ma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+212 600 00 00 00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleRoleChange(value, editForm);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="technicien">Technicien</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-8">
                      <div className="space-y-0.5">
                        <FormLabel>Actif</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Permissions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="permissions.contacts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Contacts</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="permissions.inventory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Inventaire</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="permissions.events"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Évènements</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="permissions.quotes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Devis/Factures</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="permissions.settings"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Paramètres</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="permissions.admin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Administration</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              {currentUser && `Cette action supprimera définitivement "${currentUser.fullName}" du système.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
