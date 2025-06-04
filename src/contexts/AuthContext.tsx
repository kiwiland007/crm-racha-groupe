import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ForgotPassword } from '@/components/auth/ForgotPassword';
import Logo from '@/components/ui/logo';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  phone?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateurs de démonstration
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Youssef Alami',
    email: 'youssef@rachabusiness.com',
    role: 'admin',
    phone: '+212 6 69 38 28 28',
    department: 'Direction'
  },
  {
    id: '2',
    name: 'Fatima Benkirane',
    email: 'fatima@rachabusiness.com',
    role: 'manager',
    phone: '+212 6 12 34 56 78',
    department: 'Commercial'
  },
  {
    id: '3',
    name: 'Sara Zouiten',
    email: 'sara@rachabusiness.com',
    role: 'employee',
    phone: '+212 6 98 76 54 32',
    department: 'Technique'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        localStorage.removeItem('crm_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulation d'une authentification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier d'abord les utilisateurs de démonstration
      const foundDemoUser = demoUsers.find(u => u.email === email);
      if (foundDemoUser && (password === 'demo123' || password === 'admin')) {
        setUser(foundDemoUser);
        setIsAuthenticated(true);
        localStorage.setItem('crm_user', JSON.stringify(foundDemoUser));

        toast.success('Connexion réussie', {
          description: `Bienvenue ${foundDemoUser.name} !`
        });

        return true;
      }

      // Vérifier les utilisateurs créés via la gestion des utilisateurs
      const storedCredentials = JSON.parse(localStorage.getItem('crm_user_credentials') || '[]');
      const storedUsers = JSON.parse(localStorage.getItem('crm_users') || '[]');

      const foundCredential = storedCredentials.find((cred: any) =>
        cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );

      if (foundCredential) {
        const foundStoredUser = storedUsers.find((user: any) => user.id === foundCredential.userId);

        if (foundStoredUser && foundStoredUser.isActive) {
          // Convertir l'utilisateur au format AuthContext
          const authUser: User = {
            id: String(foundStoredUser.id),
            name: foundStoredUser.fullName,
            email: foundStoredUser.email,
            role: foundStoredUser.role as 'admin' | 'manager' | 'employee',
            phone: foundStoredUser.phone,
            department: foundStoredUser.role === 'admin' ? 'Direction' :
                       foundStoredUser.role === 'manager' ? 'Management' :
                       foundStoredUser.role === 'commercial' ? 'Commercial' : 'Technique'
          };

          setUser(authUser);
          setIsAuthenticated(true);
          localStorage.setItem('crm_user', JSON.stringify(authUser));

          toast.success('Connexion réussie', {
            description: `Bienvenue ${authUser.name} !`
          });

          return true;
        } else if (foundStoredUser && !foundStoredUser.isActive) {
          toast.error('Compte désactivé', {
            description: 'Votre compte a été désactivé. Contactez l\'administrateur.'
          });
          return false;
        }
      }

      toast.error('Identifiants incorrects', {
        description: 'Vérifiez votre email et mot de passe'
      });
      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Erreur de connexion', {
        description: 'Une erreur est survenue lors de la connexion'
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('crm_user');
    
    toast.info('Déconnexion', {
      description: 'Vous avez été déconnecté avec succès'
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('crm_user', JSON.stringify(updatedUser));
      
      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été sauvegardées'
      });
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Composant de protection des routes
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
}

// Page de connexion simple
function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    
    setIsLoading(false);
    
    if (!success) {
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center mb-6">
            <div className="flex flex-col items-center">
              {/* Logo RACHA DIGITAL intégré */}
              <svg width="300" height="60" viewBox="0 0 300 60" className="mb-2">
                {/* Icône réseau */}
                <circle cx="30" cy="30" r="25" fill="#40E0D0" fillOpacity="0.1" stroke="#40E0D0" strokeWidth="1"/>
                <circle cx="30" cy="12" r="4" fill="#40E0D0"/>
                <circle cx="48" cy="30" r="4" fill="#40E0D0"/>
                <circle cx="30" cy="48" r="4" fill="#40E0D0"/>
                <circle cx="12" cy="30" r="4" fill="#40E0D0"/>
                <circle cx="30" cy="30" r="5" fill="#40E0D0"/>

                {/* Connexions */}
                <line x1="30" y1="12" x2="30" y2="25" stroke="#40E0D0" strokeWidth="2"/>
                <line x1="48" y1="30" x2="35" y2="30" stroke="#40E0D0" strokeWidth="2"/>
                <line x1="30" y1="48" x2="30" y2="35" stroke="#40E0D0" strokeWidth="2"/>
                <line x1="12" y1="30" x2="25" y2="30" stroke="#40E0D0" strokeWidth="2"/>

                {/* Séparateur */}
                <line x1="70" y1="15" x2="70" y2="45" stroke="#E5E7EB" strokeWidth="1"/>

                {/* Texte RACHA DIGITAL */}
                <text x="85" y="35" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#40E0D0" letterSpacing="2px">
                  RACHA DIGITAL
                </text>
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion au CRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à votre espace de gestion
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-blue-600 hover:text-blue-500 underline"
            >
              Mot de passe oublié ?
            </button>
          </div>



        </form>

        <ForgotPassword
          open={showForgotPassword}
          onOpenChange={setShowForgotPassword}
        />
      </div>
    </div>
  );
}
