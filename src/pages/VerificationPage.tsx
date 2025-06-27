
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Calendar,
  Building,
  User,
  Shield,
  QrCode,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface VerificationResult {
  id: string;
  title: string;
  type: string;
  institution: string;
  recipient: string;
  date: string;
  status: 'valid' | 'revoked' | 'not_found';
  verificationDate: string;
  hashSignature?: string;
}

const VerificationPage = () => {
  const [searchCode, setSearchCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const mockResults: { [key: string]: VerificationResult } = {
    'ECR-2024-001': {
      id: 'ECR-2024-001',
      title: 'Licence en Informatique',
      type: 'Diplôme',
      institution: 'Université de Kinshasa',
      recipient: 'Jean Kabila Kabange',
      date: '2024-06-15',
      status: 'valid',
      verificationDate: new Date().toISOString(),
      hashSignature: 'a1b2c3d4e5f6789...'
    },
    'ECR-2024-002': {
      id: 'ECR-2024-002',
      title: 'Master en Gestion',
      type: 'Diplôme',
      institution: 'UNIKIN - Faculté des Sciences Économiques',
      recipient: 'Marie Tshisekedi Mbuyi',
      date: '2024-05-20',
      status: 'revoked',
      verificationDate: new Date().toISOString(),
      hashSignature: 'x9y8z7w6v5u4321...'
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchCode.trim()) {
      toast.error('Veuillez entrer un code de vérification');
      return;
    }

    setIsSearching(true);

    // Simulation de la recherche
    setTimeout(() => {
      const result = mockResults[searchCode.toUpperCase()];
      
      if (result) {
        setVerificationResult(result);
        if (result.status === 'valid') {
          toast.success('Document vérifié avec succès !');
        } else if (result.status === 'revoked') {
          toast.error('Attention : Ce document a été révoqué');
        }
      } else {
        setVerificationResult({
          id: searchCode,
          title: '',
          type: '',
          institution: '',
          recipient: '',
          date: '',
          status: 'not_found',
          verificationDate: new Date().toISOString()
        });
        toast.error('Document non trouvé ou code invalide');
      }
      
      setIsSearching(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  const resetSearch = () => {
    setSearchCode('');
    setVerificationResult(null);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'valid':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Valide et authentique',
          bgColor: 'bg-green-50 border-green-200'
        };
      case 'revoked':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Révoqué',
          bgColor: 'bg-red-50 border-red-200'
        };
      case 'not_found':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Non trouvé',
          bgColor: 'bg-gray-50 border-gray-200'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Inconnu',
          bgColor: 'bg-gray-50 border-gray-200'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Vérification Publique
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vérifiez l'authenticité d'un diplôme, certificat ou titre foncier de la République Démocratique du Congo
            </p>
          </div>
        </div>

        {/* Formulaire de recherche */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">
              Entrez le code de vérification
            </CardTitle>
            <CardDescription>
              Le code se trouve généralement sur le document ou dans le QR code
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Ex: ECR-2024-001"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="pl-12 h-14 text-lg"
                  disabled={isSearching}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-lg shadow-lg"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Vérification en cours...
                  </div>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Vérifier le document
                  </>
                )}
              </Button>
            </form>

            {/* Codes d'exemple */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-900 mb-2">Codes d'exemple pour test :</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSearchCode('ECR-2024-001')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  ECR-2024-001 (Valide)
                </button>
                <button
                  onClick={() => setSearchCode('ECR-2024-002')}
                  className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  ECR-2024-002 (Révoqué)
                </button>
                <button
                  onClick={() => setSearchCode('ECR-2024-999')}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                >
                  ECR-2024-999 (Non trouvé)
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultat de la vérification */}
        {verificationResult && (
          <Card className={`shadow-lg border-2 ${getStatusInfo(verificationResult.status).bgColor}`}>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getStatusInfo(verificationResult.status).icon}
                <CardTitle className="text-xl">
                  Résultat de la vérification
                </CardTitle>
              </div>
              
              <Badge className={`${getStatusInfo(verificationResult.status).color} border text-base py-2 px-4`}>
                {getStatusInfo(verificationResult.status).label}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {verificationResult.status !== 'not_found' ? (
                <>
                  {/* Informations du document */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Informations du document
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Titre</label>
                          <p className="text-gray-900 font-medium">{verificationResult.title}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Type</label>
                          <p className="text-gray-900">{verificationResult.type}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Code ID</label>
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-900 font-mono">{verificationResult.id}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(verificationResult.id)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Bénéficiaire</label>
                          <p className="text-gray-900 font-medium">{verificationResult.recipient}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Institution</label>
                          <p className="text-gray-900">{verificationResult.institution}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Date d'émission</label>
                          <p className="text-gray-900">
                            {new Date(verificationResult.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations de sécurité */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 text-green-600 mr-2" />
                      Sécurité et traçabilité
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Vérifié le</span>
                        <span className="text-gray-900">
                          {new Date(verificationResult.verificationDate).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      
                      {verificationResult.hashSignature && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Hash blockchain</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-900 font-mono text-xs">
                              {verificationResult.hashSignature}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(verificationResult.hashSignature!)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {verificationResult.status === 'revoked' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-900">Document révoqué</h4>
                          <p className="text-sm text-red-700 mt-1">
                            Ce document a été révoqué par l'institution émettrice. Il n'est plus valide.
                            Contactez l'institution pour plus d'informations.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Document non trouvé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Le code <strong>{verificationResult.id}</strong> ne correspond à aucun document dans notre base de données.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Vérifiez que le code est correct ou contactez l'institution émettrice.</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button onClick={resetSearch} variant="outline" className="flex-1">
                  Nouvelle vérification
                </Button>
                <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <a href="/scan">
                    <QrCode className="w-4 h-4 mr-2" />
                    Scanner QR code
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations sur le service */}
        <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Service de vérification officiel</h3>
              <p className="text-blue-100 text-sm">
                Cette plateforme est sécurisée par la technologie blockchain et certifiée par 
                le Ministère de l'Enseignement Supérieur et Universitaire de la RDC.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
