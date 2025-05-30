import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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

      // Vérification des identifiants de démonstration
      const foundUser = demoUsers.find(u => u.email === email);
      
      if (foundUser && (password === 'demo123' || password === 'admin')) {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem('crm_user', JSON.stringify(foundUser));
        
        toast.success('Connexion réussie', {
          description: `Bienvenue ${foundUser.name} !`
        });
        
        return true;
      } else {
        toast.error('Identifiants incorrects', {
          description: 'Vérifiez votre email et mot de passe'
        });
        return false;
      }
    } catch (error) {
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
          <div className="mx-auto h-12 w-auto flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Racha Business Digital" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.style.display = 'block';
              }}
            />
            <div className="hidden text-2xl font-bold text-blue-600">
              Racha Digital
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
            <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-md">
              <p className="font-medium mb-2">Comptes de démonstration :</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> youssef@rachabusiness.com</p>
                <p><strong>Manager:</strong> fatima@rachabusiness.com</p>
                <p><strong>Employé:</strong> sara@rachabusiness.com</p>
                <p className="mt-2"><strong>Mot de passe:</strong> demo123</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
