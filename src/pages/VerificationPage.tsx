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
  Shield,
  QrCode,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { verifyDocument } from '@/services/web3Service';

interface VerificationResult {
  isValid: boolean;
  ownerName: string;
  documentType: string;
  timestamp: number;
  registrationDate: string;
  blockchainVerified: boolean;
}

const VerificationPage = () => {
  const [searchCode, setSearchCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchCode.trim()) {
      toast.error('Veuillez entrer un hash de document');
      return;
    }

    setIsSearching(true);

    try {
      const result = await verifyDocument(searchCode.trim());
      
      if (result.isValid) {
        setVerificationResult({
          isValid: true,
          ownerName: result.ownerName,
          documentType: result.documentType,
          timestamp: result.timestamp,
          registrationDate: result.registrationDate,
          blockchainVerified: true
        });
        toast.success('Document vérifié avec succès sur la blockchain !');
      } else {
        setVerificationResult({
          isValid: false,
          ownerName: '',
          documentType: '',
          timestamp: 0,
          registrationDate: '',
          blockchainVerified: false
        });
        toast.error('Document non trouvé sur la blockchain');
      }
    } catch (error: any) {
      console.error('Erreur de vérification:', error);
      setVerificationResult({
        isValid: false,
        ownerName: '',
        documentType: '',
        timestamp: 0,
        registrationDate: '',
        blockchainVerified: false
      });
      toast.error(`Erreur: ${error.message || 'Impossible de vérifier le document'}`);
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  const resetSearch = () => {
    setSearchCode('');
    setVerificationResult(null);
  };

  const getStatusInfo = (result: VerificationResult | null) => {
    if (!result) return null;
    
    if (result.isValid && result.blockchainVerified) {
      return {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Valide et vérifié sur blockchain',
        bgColor: 'bg-green-50 border-green-200'
      };
    } else {
      return {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Non trouvé sur la blockchain',
        bgColor: 'bg-red-50 border-red-200'
      };
    }
  };

  const statusInfo = getStatusInfo(verificationResult);

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
              Vérification Blockchain
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vérifiez l'authenticité d'un document enregistré sur la blockchain Polygon
            </p>
          </div>
        </div>

        {/* Formulaire de recherche */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900 flex items-center justify-center">
              <Shield className="w-5 h-5 mr-2" />
              Entrez le hash du document
            </CardTitle>
            <CardDescription>
              Le hash est généré lors de l'enregistrement du document sur la blockchain
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Ex: 0xa1b2c3d4e5f6789..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="pl-12 h-14 text-lg font-mono"
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
                    Vérification sur blockchain...
                  </div>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Vérifier sur Blockchain
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Résultat de la vérification */}
        {verificationResult && statusInfo && (
          <Card className={`shadow-lg border-2 ${statusInfo.bgColor}`}>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                {statusInfo.icon}
                <CardTitle className="text-xl">
                  Résultat de la vérification blockchain
                </CardTitle>
              </div>
              
              <Badge className={`${statusInfo.color} border text-base py-2 px-4`}>
                {statusInfo.label}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {verificationResult.isValid ? (
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
                          <label className="text-sm font-medium text-gray-600">Propriétaire</label>
                          <p className="text-gray-900 font-medium">{verificationResult.ownerName}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Type de document</label>
                          <p className="text-gray-900">{verificationResult.documentType}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Date d'enregistrement</label>
                          <p className="text-gray-900">
                            {new Date(verificationResult.registrationDate).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Hash du document</label>
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-900 font-mono text-sm break-all">{searchCode}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(searchCode)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations blockchain */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 text-blue-600 mr-2" />
                      Vérification blockchain
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Réseau</span>
                        <span className="text-blue-900 font-medium">Polygon Mumbai Testnet</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Statut</span>
                        <span className="text-green-700 font-medium">✓ Vérifié</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700">Timestamp</span>
                        <span className="text-blue-900">{verificationResult.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Document non trouvé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Le hash <strong>{searchCode}</strong> ne correspond à aucun document enregistré sur la blockchain.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Vérifiez que le hash est correct ou que le document a bien été enregistré.</p>
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
              <h3 className="text-lg font-semibold mb-2">Sécurisé par la blockchain</h3>
              <p className="text-blue-100 text-sm">
                Les documents sont enregistrés de manière immuable sur la blockchain Polygon, 
                garantissant leur authenticité et leur intégrité.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
