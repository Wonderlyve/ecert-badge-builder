
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Bell,
  Lock,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    institution: user?.institution || ''
  });

  const handleSave = async () => {
    // Simulation de la sauvegarde
    toast.info('Mise à jour du profil...');
    
    setTimeout(() => {
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès !');
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      institution: user?.institution || ''
    });
    setIsEditing(false);
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'establishment':
        return 'Établissement';
      case 'student':
        return 'Étudiant';
      case 'citizen':
        return 'Citoyen';
      case 'employer':
        return 'Employeur';
      default:
        return 'Utilisateur';
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'establishment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'citizen':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'employer':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Mon Profil
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
        
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Informations personnelles</span>
              </CardTitle>
              {isEditing && (
                <CardDescription>
                  Modifiez vos informations et cliquez sur "Sauvegarder"
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Nom complet
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom complet"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{user?.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Adresse email
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                      type="email"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.email}</p>
                  )}
                </div>
              </div>

              {(user?.role === 'establishment' || user?.role === 'student') && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Institution
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.institution}
                      onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="Nom de l'institution"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.institution}</p>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Type de compte
                </label>
                <Badge className={`${getRoleColor(user?.role)} border`}>
                  {getRoleLabel(user?.role)}
                </Badge>
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques d'activité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Activité du compte</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Documents consultés</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-gray-600">Vérifications</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-sm text-gray-600">Téléchargements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Statut du compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Statut du compte</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                {user?.verified ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">Compte vérifié</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-700 font-medium">En attente de vérification</span>
                  </>
                )}
              </div>
              
              {!user?.verified && user?.role === 'establishment' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Votre compte d'établissement est en cours de vérification. 
                    Ce processus peut prendre 24-48h.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Membre depuis {new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info('Fonctionnalité en développement')}
              >
                <Lock className="w-4 h-4 mr-2" />
                Changer le mot de passe
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info('Fonctionnalité en développement')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Préférences notifications
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast.info('Fonctionnalité en développement')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Support technique
              </Button>
            </CardContent>
          </Card>

          {/* Informations de sécurité */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800">Sécurité</span>
              </div>
              <p className="text-xs text-gray-600">
                Vos données sont protégées par un chiffrement de niveau bancaire. 
                Nous ne partageons jamais vos informations personnelles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
