import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  User,
  Settings,
  LogOut,
  Edit,
  Phone,
  Mail,
  Building,
  Shield,
  Save,
  X,
  Lock,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

export function UserProfile() {
  const { user, logout, updateProfile } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Administrateur', color: 'bg-red-100 text-red-800' },
      manager: { label: 'Manager', color: 'bg-blue-100 text-blue-800' },
      employee: { label: 'Employé', color: 'bg-green-100 text-green-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.employee;
    
    return (
      <Badge variant="outline" className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const handleSaveProfile = () => {
    updateProfile(formData);
    setEditMode(false);
    setShowProfileDialog(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || ''
    });
    setEditMode(false);
  };

  const handleChangePassword = () => {
    setShowSettingsDialog(false);
    setShowPasswordDialog(true);
  };

  const handleEnable2FA = () => {
    setShowSettingsDialog(false);
    setShow2FADialog(true);
  };

  const handlePasswordSubmit = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs"
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Erreur", {
        description: "Les nouveaux mots de passe ne correspondent pas"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Erreur", {
        description: "Le mot de passe doit contenir au moins 8 caractères"
      });
      return;
    }

    // Simulation de changement de mot de passe
    toast.success("Mot de passe modifié", {
      description: "Votre mot de passe a été mis à jour avec succès"
    });

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordDialog(false);
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);

    if (!twoFactorEnabled) {
      toast.success("Authentification à deux facteurs activée", {
        description: "Votre compte est maintenant plus sécurisé"
      });
    } else {
      toast.info("Authentification à deux facteurs désactivée", {
        description: "L'authentification à deux facteurs a été désactivée"
      });
    }

    setShow2FADialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Profil */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil utilisateur
            </DialogTitle>
            <DialogDescription>
              Consultez et modifiez vos informations personnelles
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Avatar et informations de base */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  {getRoleBadge(user.role)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  {user.role === 'admin' ? 'Accès complet' : 
                   user.role === 'manager' ? 'Accès étendu' : 'Accès standard'}
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nom
                </Label>
                {editMode ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="col-span-3"
                  />
                ) : (
                  <div className="col-span-3 text-sm">{user.name}</div>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                {editMode ? (
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="col-span-3"
                    type="email"
                  />
                ) : (
                  <div className="col-span-3 text-sm">{user.email}</div>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </Label>
                {editMode ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="col-span-3"
                  />
                ) : (
                  <div className="col-span-3 text-sm">{user.phone || 'Non renseigné'}</div>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Service
                </Label>
                {editMode ? (
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="col-span-3"
                  />
                ) : (
                  <div className="col-span-3 text-sm">{user.department || 'Non renseigné'}</div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            {editMode ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <Button onClick={() => setEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Paramètres */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres
            </DialogTitle>
            <DialogDescription>
              Configurez vos préférences d'utilisation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Notifications par email</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Notifications push</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Notifications SMS</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Préférences d'affichage</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Mode sombre automatique</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Affichage compact</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sécurité</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" onClick={handleChangePassword}>
                  <Lock className="mr-2 h-4 w-4" />
                  Changer le mot de passe
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={handleEnable2FA}>
                  <Shield className="mr-2 h-4 w-4" />
                  Authentification à deux facteurs
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowSettingsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Changement de mot de passe */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Changer le mot de passe
            </DialogTitle>
            <DialogDescription>
              Modifiez votre mot de passe pour sécuriser votre compte
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Entrez votre mot de passe actuel"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Entrez votre nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Le mot de passe doit contenir au moins 8 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handlePasswordSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Modifier le mot de passe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Authentification à deux facteurs */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentification à deux facteurs
            </DialogTitle>
            <DialogDescription>
              Renforcez la sécurité de votre compte avec l'authentification à deux facteurs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                <Key className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">
                  {twoFactorEnabled ? "Authentification à deux facteurs activée" : "Authentification à deux facteurs désactivée"}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {twoFactorEnabled
                    ? "Votre compte est protégé par l'authentification à deux facteurs"
                    : "Activez l'authentification à deux facteurs pour plus de sécurité"
                  }
                </p>
              </div>
              <div className="flex-shrink-0">
                <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                  {twoFactorEnabled ? "Activé" : "Désactivé"}
                </Badge>
              </div>
            </div>

            {!twoFactorEnabled && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">
                    Comment ça fonctionne ?
                  </h5>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Un code sera envoyé à votre téléphone à chaque connexion</li>
                    <li>• Vous devrez saisir ce code en plus de votre mot de passe</li>
                    <li>• Votre compte sera ainsi mieux protégé contre les intrusions</li>
                  </ul>
                </div>
              </div>
            )}

            {twoFactorEnabled && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="text-sm font-medium text-green-900 mb-2">
                    Authentification active
                  </h5>
                  <p className="text-xs text-green-800">
                    Votre compte est protégé par l'authentification à deux facteurs.
                    Vous pouvez la désactiver si nécessaire.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleToggle2FA} variant={twoFactorEnabled ? "destructive" : "default"}>
              {twoFactorEnabled ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Désactiver
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Activer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
