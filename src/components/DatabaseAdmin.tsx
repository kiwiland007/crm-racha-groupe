import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { crmDatabase } from '../services/crmDatabaseService';

interface DatabaseStats {
  categories: number;
  contacts: number;
  products: number;
  quotes: number;
  invoices: number;
  deliveryNotes: number;
  events: number;
  tasks: number;
  notifications: number;
  inventory: number;
}

export const DatabaseAdmin: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await crmDatabase.getStats();
      if (result.success) {
        setStats(result.data);
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors du chargement des statistiques' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion à la base de données' });
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    setSyncing(true);
    setMessage(null);
    
    try {
      const result = await crmDatabase.syncFromLocalStorage();
      if (result.success) {
        setMessage({ type: 'success', text: 'Synchronisation réussie !' });
        await loadStats(); // Recharger les stats
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de la synchronisation' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la synchronisation' });
    } finally {
      setSyncing(false);
    }
  };

  const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className="text-blue-500">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administration Base de Données</h1>
              <p className="text-gray-600">Gestion et synchronisation des données MySQL</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={loadStats}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
            
            <button
              onClick={syncData}
              disabled={syncing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Synchronisation...' : 'Synchroniser'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Configuration de la base de données */}
      <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration Base de Données</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Mode actuel:</span>
            <span className="ml-2 text-blue-600">localStorage (Frontend)</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Configuration MySQL:</span>
            <span className="ml-2 text-gray-900">localhost:3306/admin_crm</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Utilisateur:</span>
            <span className="ml-2 text-gray-900">kiwiland</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Statut:</span>
            <span className="ml-2 text-orange-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              localStorage (API backend requis pour MySQL)
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> L'application utilise actuellement localStorage.
            Pour utiliser MySQL, un serveur backend Node.js est nécessaire.
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Statistiques des données
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard 
              label="Catégories" 
              value={stats.categories} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Contacts" 
              value={stats.contacts} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Produits" 
              value={stats.products} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Devis" 
              value={stats.quotes} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Factures" 
              value={stats.invoices} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Bons de livraison" 
              value={stats.deliveryNotes} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Événements" 
              value={stats.events} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Tâches" 
              value={stats.tasks} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Notifications" 
              value={stats.notifications} 
              icon={<Database className="h-6 w-6" />} 
            />
            <StatCard 
              label="Inventaire" 
              value={stats.inventory} 
              icon={<Database className="h-6 w-6" />} 
            />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Total des enregistrements:</strong> {' '}
              {Object.values(stats).reduce((sum, count) => sum + count, 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• <strong>Actualiser:</strong> Recharge les statistiques depuis localStorage</p>
          <p>• <strong>Synchroniser:</strong> Simule une synchronisation (fonctionnalité future)</p>
          <p>• Les données sont actuellement stockées dans localStorage du navigateur</p>
          <p>• Pour utiliser MySQL, un serveur backend Node.js doit être développé</p>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Configuration MySQL disponible</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>• Serveur: localhost:3306</p>
            <p>• Base: admin_crm</p>
            <p>• Utilisateur: kiwiland</p>
            <p>• Mot de passe: j_ZAWdxkw91*fvq0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseAdmin;
