
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Share2, 
  QrCode, 
  Search,
  Filter,
  Plus,
  Calendar,
  GraduationCap,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle,
  School,
  Landmark
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  type: 'diploma' | 'certificate' | 'land_title' | 'land_certificate';
  institution: string;
  date: string;
  status: 'valid' | 'pending' | 'revoked';
  qrCode: string;
  recipient?: string;
  ministry?: 'education' | 'land';
}

const DocumentsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');

  // Documents mockés incluant les nouveaux types ministériels
  const mockDocuments: Document[] = [
    {
      id: 'ECR-2024-001',
      title: 'Licence en Informatique',
      type: 'diploma',
      institution: 'Université de Kinshasa',
      date: '2024-06-15',
      status: 'valid',
      qrCode: 'QR123456789',
      recipient: 'Jean Kabila',
      ministry: 'education'
    },
    {
      id: 'ECR-2024-002',
      title: 'Certificat de Formation Continue',
      type: 'certificate',
      institution: 'IFASIC',
      date: '2024-05-20',
      status: 'valid',
      qrCode: 'QR987654321',
      recipient: 'Marie Tshisekedi',
      ministry: 'education'
    },
    {
      id: 'ECR-2023-015',
      title: 'Titre Foncier - Parcelle 123',
      type: 'land_title',
      institution: 'Ministère des Affaires Foncières',
      date: '2023-12-10',
      status: 'valid',
      qrCode: 'QR456789123',
      recipient: 'Paul Mukendi',
      ministry: 'land'
    },
    {
      id: 'ECR-2024-003',
      title: 'Certificat de Propriété Foncière',
      type: 'land_certificate',
      institution: 'Ministère des Affaires Foncières',
      date: '2024-03-15',
      status: 'valid',
      qrCode: 'QR789123456',
      recipient: 'Sylvie Mulamba',
      ministry: 'land'
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'diploma':
        return <GraduationCap className="w-5 h-5" />;
      case 'certificate':
        return <FileText className="w-5 h-5" />;
      case 'land_title':
        return <Landmark className="w-5 h-5" />;
      case 'land_certificate':
        return <MapPin className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'revoked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'revoked':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleDownload = (doc: Document) => {
    toast.success(`Téléchargement de ${doc.title} en cours...`);
  };

  const handleShare = (doc: Document) => {
    navigator.clipboard.writeText(`https://ecert.cd/verify/${doc.id}`);
    toast.success('Lien de partage copié dans le presse-papiers');
  };

  // Filtrer les documents selon le rôle de l'utilisateur
  const getFilteredDocuments = () => {
    let documents = mockDocuments;
    
    // Filtrer par rôle utilisateur
    if (user?.role === 'ministry_education') {
      documents = documents.filter(doc => doc.ministry === 'education');
    } else if (user?.role === 'ministry_land') {
      documents = documents.filter(doc => doc.ministry === 'land');
    }
    
    // Appliquer les filtres de recherche
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (doc.recipient && doc.recipient.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || doc.type === filterType;
      
      const docYear = new Date(doc.date).getFullYear().toString();
      const matchesYear = filterYear === 'all' || docYear === filterYear;
      
      return matchesSearch && matchesType && matchesYear;
    });
  };

  const filteredDocuments = getFilteredDocuments();

  const getDocumentTypes = () => {
    if (user?.role === 'ministry_education') {
      return [
        { value: 'all', label: 'Tous les types' },
        { value: 'diploma', label: 'Diplômes' },
        { value: 'certificate', label: 'Certificats' }
      ];
    } else if (user?.role === 'ministry_land') {
      return [
        { value: 'all', label: 'Tous les types' },
        { value: 'land_title', label: 'Titres fonciers' },
        { value: 'land_certificate', label: 'Certificats de propriété' }
      ];
    } else {
      return [
        { value: 'all', label: 'Tous les types' },
        { value: 'diploma', label: 'Diplômes' },
        { value: 'certificate', label: 'Certificats' },
        { value: 'land_title', label: 'Titres fonciers' },
        { value: 'land_certificate', label: 'Certificats de propriété' }
      ];
    }
  };

  const getPageTitle = () => {
    if (user?.role === 'ministry_education') {
      return 'Documents éducatifs';
    } else if (user?.role === 'ministry_land') {
      return 'Documents fonciers';
    } else if (user?.role === 'establishment') {
      return 'Gestion des documents';
    } else {
      return 'Mes documents';
    }
  };

  const getPageDescription = () => {
    if (user?.role === 'ministry_education') {
      return 'Gérez les diplômes et certificats du système éducatif';
    } else if (user?.role === 'ministry_land') {
      return 'Gérez les titres fonciers et certificats de propriété';
    } else if (user?.role === 'establishment') {
      return 'Gérez les diplômes et certificats de votre établissement';
    } else {
      return 'Consultez et téléchargez vos documents certifiés';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600 mt-1">
            {getPageDescription()}
          </p>
        </div>
        
        {(['establishment', 'ministry_education', 'ministry_land'].includes(user?.role || '')) && (
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau document
          </Button>
        )}
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                {getDocumentTypes().map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full sm:w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || filterYear !== 'all'
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Vous n\'avez pas encore de documents certifiés.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getDocumentIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {doc.title}
                        </h3>
                        <Badge className={`${getStatusColor(doc.status)} border`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(doc.status)}
                            <span className="capitalize">
                              {doc.status === 'valid' ? 'Valide' : 
                               doc.status === 'pending' ? 'En attente' : 'Révoqué'}
                            </span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 space-x-4 mb-2">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {doc.institution}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(doc.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      {doc.recipient && ['establishment', 'ministry_education', 'ministry_land'].includes(user?.role || '') && (
                        <p className="text-sm text-gray-600">
                          <strong>Bénéficiaire:</strong> {doc.recipient}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {doc.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc)}
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(doc)}
                      className="flex-1 sm:flex-none"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Statistiques pour les ministères et établissements */}
      {(['establishment', 'ministry_education', 'ministry_land'].includes(user?.role || '')) && filteredDocuments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {filteredDocuments.length}
              </p>
              <p className="text-sm text-gray-600">Documents total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {filteredDocuments.filter(d => d.status === 'valid').length}
              </p>
              <p className="text-sm text-gray-600">Valides</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {filteredDocuments.filter(d => d.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">En attente</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
