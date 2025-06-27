
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Calendar,
  Building,
  User,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

interface ScannedDocument {
  id: string;
  title: string;
  type: 'diploma' | 'certificate' | 'land_title';
  institution: string;
  recipient: string;
  date: string;
  status: 'valid' | 'revoked';
  verificationDate: string;
}

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDocument, setScannedDocument] = useState<ScannedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document mocké pour la démonstration
  const mockDocument: ScannedDocument = {
    id: 'ECR-2024-001',
    title: 'Licence en Informatique',
    type: 'diploma',
    institution: 'Université de Kinshasa',
    recipient: 'Jean Kabila Kabange',
    date: '2024-06-15',
    status: 'valid',
    verificationDate: new Date().toISOString()
  };

  const startCamera = async () => {
    setIsScanning(true);
    
    try {
      // Simulation du scan de caméra
      toast.info('Positionnez le QR code devant la caméra...');
      
      // Simuler le scan après 3 secondes
      setTimeout(() => {
        setScannedDocument(mockDocument);
        setIsScanning(false);
        toast.success('QR code scanné avec succès !');
      }, 3000);
      
    } catch (error) {
      toast.error('Erreur d\'accès à la caméra. Vérifiez les permissions.');
      setIsScanning(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulation du traitement de l'image
      toast.info('Analyse de l\'image en cours...');
      
      setTimeout(() => {
        setScannedDocument(mockDocument);
        toast.success('QR code détecté dans l\'image !');
      }, 2000);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'diploma':
        return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case 'certificate':
        return <FileText className="w-6 h-6 text-green-600" />;
      case 'land_title':
        return <MapPin className="w-6 h-6 text-purple-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'diploma':
        return 'Diplôme';
      case 'certificate':
        return 'Certificat';
      case 'land_title':
        return 'Titre Foncier';
      default:
        return 'Document';
    }
  };

  const resetScan = () => {
    setScannedDocument(null);
    setIsScanning(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Scanner QR Code
        </h1>
        <p className="text-gray-600">
          Vérifiez l'authenticité d'un document en scannant son QR code
        </p>
      </div>

      {!scannedDocument ? (
        <div className="max-w-2xl mx-auto">
          {/* Scanner Interface */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <QrCode className="w-6 h-6 text-blue-600" />
                <span>Scanner un QR Code</span>
              </CardTitle>
              <CardDescription>
                Choisissez une méthode pour scanner le QR code du document
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {isScanning ? (
                <div className="text-center py-12">
                  <div className="relative mx-auto w-64 h-64 bg-gray-900 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                        
                        {/* Ligne de scan animée */}
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white text-sm">Positionnez le QR code</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-blue-600 font-medium">Scan en cours...</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setIsScanning(false)}
                    >
                      Arrêter le scan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={startCamera}
                    className="h-32 flex-col space-y-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-8 h-8" />
                    <span className="text-lg font-medium">Utiliser la caméra</span>
                    <span className="text-sm opacity-90">Scanner en temps réel</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 flex-col space-y-2 border-2 border-dashed border-gray-300 hover:border-blue-500"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-lg font-medium">Uploader une image</span>
                    <span className="text-sm text-gray-600">JPG, PNG acceptés</span>
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <p>Assurez-vous que le QR code est bien visible et non endommagé</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <p>Maintenez le document stable pour un scan optimal</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <p>La vérification se fait en temps réel avec nos serveurs sécurisés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Résultat du scan */
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <CardTitle className="text-xl text-green-800">
                  Document Vérifié
                </CardTitle>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="w-4 h-4 mr-1" />
                Authentique et valide
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Informations du document */}
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getDocumentIcon(scannedDocument.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {scannedDocument.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {getDocumentTypeLabel(scannedDocument.type)} • ID: {scannedDocument.id}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{scannedDocument.recipient}</p>
                          <p className="text-gray-600">Bénéficiaire</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{scannedDocument.institution}</p>
                          <p className="text-gray-600">Institution</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(scannedDocument.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-gray-600">Date d'émission</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(scannedDocument.verificationDate).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-gray-600">Vérifié le</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails de sécurité */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Sécurité et authentification
                </h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Signature numérique vérifiée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Hash blockchain confirmé</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Institution certifiée</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={resetScan} variant="outline" className="flex-1">
                  Scanner un autre
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Voir les détails
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
