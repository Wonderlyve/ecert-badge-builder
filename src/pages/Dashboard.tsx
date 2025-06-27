import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  QrCode,
  Download,
  Plus,
  Building,
  GraduationCap,
  MapPin,
  School,
  Landmark,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RegisterDocumentModal from '@/components/RegisterDocumentModal';
import CreateCertificateModal from '@/components/CreateCertificateModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'establishment':
        return <EstablishmentDashboard />;
      case 'ministry_education':
        return <MinistryEducationDashboard />;
      case 'ministry_land':
        return <MinistryLandDashboard />;
      case 'student':
      case 'citizen':
        return <UserDashboard />;
      case 'employer':
        return <EmployerDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord - {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            {getRoleDisplayName(user?.role)} - {user?.institution}
          </p>
        </div>
        
        <div className="flex space-x-3">
          {(user?.role === 'admin' || user?.role === 'ministry_education' || user?.role === 'ministry_land') && (
            <>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer Certificat
              </Button>
              <Button 
                onClick={() => setShowRegisterModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Enregistrer sur Blockchain
              </Button>
            </>
          )}
        </div>
      </div>

      {getDashboardContent()}
      
      {/* Modals */}
      <CreateCertificateModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      
      <RegisterDocumentModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </div>
  );
};

const QuickActions = ({ role }: { role?: string }) => {
  const getActions = () => {
    switch (role) {
      case 'establishment':
        return [
          { label: 'Nouveau diplôme', href: '/documents?action=create', icon: Plus },
          { label: 'Scanner QR', href: '/scan', icon: QrCode }
        ];
      case 'ministry_education':
        return [
          { label: 'Nouveau diplôme', href: '/documents?action=create&type=education', icon: School },
          { label: 'Scanner QR', href: '/scan', icon: QrCode }
        ];
      case 'ministry_land':
        return [
          { label: 'Nouveau titre', href: '/documents?action=create&type=land', icon: Landmark },
          { label: 'Scanner QR', href: '/scan', icon: QrCode }
        ];
      default:
        return [
          { label: 'Mes documents', href: '/documents', icon: FileText },
          { label: 'Scanner QR', href: '/scan', icon: QrCode }
        ];
    }
  };

  const actions = getActions();

  return (
    <div className="flex space-x-2">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Button key={action.label} asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to={action.href}>
              <IconComponent className="w-4 h-4 mr-2" />
              {action.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

const AdminDashboard = () => {
  const stats = [
    { title: 'Établissements', value: '142', icon: Building, color: 'bg-blue-500' },
    { title: 'Documents émis', value: '2,847', icon: FileText, color: 'bg-green-500' },
    { title: 'Vérifications', value: '1,234', icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'En attente', value: '23', icon: AlertCircle, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouveau diplôme certifié</p>
                  <p className="text-xs text-gray-500">Université de Kinshasa - il y a 2h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Vérification effectuée</p>
                  <p className="text-xs text-gray-500">Document #ECR-2024-001 - il y a 4h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Établissement en attente</p>
                  <p className="text-xs text-gray-500">ISIPA - il y a 6h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Statistiques de la semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Documents émis</span>
                <span className="text-sm font-bold text-green-600">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vérifications</span>
                <span className="text-sm font-bold text-blue-600">+8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
                <span className="text-sm font-bold text-purple-600">+15%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EstablishmentDashboard = () => {
  const stats = [
    { title: 'Diplômes émis', value: '89', icon: GraduationCap, color: 'bg-blue-500' },
    { title: 'Étudiants', value: '156', icon: Users, color: 'bg-green-500' },
    { title: 'Vérifications', value: '234', icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'Ce mois', value: '12', icon: TrendingUp, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérez vos diplômes et certificats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?action=create">
                  <Plus className="w-6 h-6" />
                  <span>Nouveau diplôme</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?action=students">
                  <Users className="w-6 h-6" />
                  <span>Gérer étudiants</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents">
                  <FileText className="w-6 h-6" />
                  <span>Tous les documents</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/scan">
                  <QrCode className="w-6 h-6" />
                  <span>Scanner QR</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diplômes récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Licence en Informatique</p>
                  <p className="text-xs text-gray-500">Jean Kabila - Aujourd'hui</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Master en Gestion</p>
                  <p className="text-xs text-gray-500">Marie Tshisekedi - Hier</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Diplôme en Médecine</p>
                  <p className="text-xs text-gray-500">Paul Mukendi - Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mes documents</CardTitle>
            <CardDescription>Vos diplômes et certificats certifiés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Licence en Informatique</p>
                    <p className="text-sm text-gray-600">Université de Kinshasa - 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Titre foncier</p>
                    <p className="text-sm text-gray-600">Parcelle 123, Kinshasa - 2023</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>

              <div className="text-center py-8">
                <Button asChild variant="outline">
                  <Link to="/documents">
                    <FileText className="w-4 h-4 mr-2" />
                    Voir tous mes documents
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/scan">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scanner un QR code
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/verification">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Vérifier un document
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/profile">
                  <Users className="w-4 h-4 mr-2" />
                  Mon profil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EmployerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vérifications récentes</CardTitle>
            <CardDescription>Documents vérifiés pour vos candidats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Jean Kabila</p>
                    <p className="text-sm text-gray-600">Licence en Informatique - Vérifié</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Valide
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">Marie Tshisekedi</p>
                    <p className="text-sm text-gray-600">Master en Gestion - Non vérifié</p>
                  </div>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                  Invalide
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outils de vérification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/scan">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scanner QR code
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/verification">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Vérification manuelle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MinistryEducationDashboard = () => {
  const stats = [
    { title: 'Diplômes émis', value: '1,247', icon: School, color: 'bg-blue-500' },
    { title: 'Établissements', value: '89', icon: Building, color: 'bg-green-500' },
    { title: 'Vérifications', value: '3,456', icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'Ce mois', value: '156', icon: TrendingUp, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gestion des documents éducatifs</CardTitle>
            <CardDescription>Créez et gérez les diplômes et certificats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?action=create&type=diploma">
                  <GraduationCap className="w-6 h-6" />
                  <span>Nouveau diplôme</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?action=create&type=certificate">
                  <FileText className="w-6 h-6" />
                  <span>Nouveau certificat</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?filter=education">
                  <School className="w-6 h-6" />
                  <span>Documents éducatifs</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/scan">
                  <QrCode className="w-6 h-6" />
                  <span>Scanner QR</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Licence en Informatique</p>
                  <p className="text-xs text-gray-500">Université de Kinshasa - Aujourd'hui</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Certificat de Formation</p>
                  <p className="text-xs text-gray-500">IFASIC - Hier</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Master en Gestion</p>
                  <p className="text-xs text-gray-500">UPC - Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MinistryLandDashboard = () => {
  const stats = [
    { title: 'Titres fonciers', value: '2,847', icon: Landmark, color: 'bg-blue-500' },
    { title: 'Parcelles', value: '15,234', icon: MapPin, color: 'bg-green-500' },
    { title: 'Vérifications', value: '1,876', icon: CheckCircle, color: 'bg-purple-500' },
    { title: 'Ce mois', value: '89', icon: TrendingUp, color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gestion foncière</CardTitle>
            <CardDescription>Créez et gérez les titres fonciers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?action=create&type=land_title">
                  <Landmark className="w-6 h-6" />
                  <span>Nouveau titre foncier</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?action=create&type=land_certificate">
                  <MapPin className="w-6 h-6" />
                  <span>Certificat de propriété</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/documents?filter=land">
                  <FileText className="w-6 h-6" />
                  <span>Documents fonciers</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link to="/scan">
                  <QrCode className="w-6 h-6" />
                  <span>Scanner QR</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Titres récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Titre Foncier - Parcelle 456</p>
                  <p className="text-xs text-gray-500">Kinshasa, Gombe - Aujourd'hui</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Certificat de Propriété</p>
                  <p className="text-xs text-gray-500">Lubumbashi - Hier</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Titre Foncier - Parcelle 789</p>
                  <p className="text-xs text-gray-500">Matadi - Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
