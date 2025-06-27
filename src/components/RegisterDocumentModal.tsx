
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Hash, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { registerDocument } from "@/services/web3Service";
import { hashDocumentData } from "@/utils/hash";
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";
import { useMetaMask } from "@/hooks/useMetaMask";
import QRCode from "qrcode.react";

interface RegisterDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterDocumentModal = ({ isOpen, onClose }: RegisterDocumentModalProps) => {
  const { getSigner, isConnected, walletAddress } = useMetaMask();
  
  const [formData, setFormData] = useState({
    ownerName: "",
    documentType: "",
    documentContent: "",
    institution: ""
  });
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [documentHash, setDocumentHash] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateHash = () => {
    if (!formData.ownerName || !formData.documentType) {
      toast.error("Veuillez remplir au moins le nom du propriétaire et le type de document");
      return;
    }

    const hash = hashDocumentData({
      ownerName: formData.ownerName,
      documentType: formData.documentType,
      documentContent: formData.documentContent,
      institution: formData.institution
    });
    
    setDocumentHash(hash);
    toast.success("Hash généré avec succès");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentHash) {
      toast.error("Veuillez d'abord générer le hash du document");
      return;
    }

    if (!formData.ownerName || !formData.documentType) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!isConnected) {
      toast.error("Veuillez connecter votre wallet MetaMask");
      return;
    }

    setIsRegistering(true);

    try {
      // Obtenir le signer depuis le hook MetaMask
      const signer = await getSigner();
      if (!signer) {
        toast.error("Impossible d'obtenir le signer MetaMask");
        return;
      }

      const result = await registerDocument(
        documentHash,
        formData.ownerName,
        formData.documentType,
        signer
      );
      
      setTransactionHash(result.transactionHash);
      toast.success("Document enregistré sur la blockchain avec succès!");
      
    } catch (error: any) {
      console.error("Erreur d'enregistrement:", error);
      toast.error(`Erreur: ${error.message || "Impossible d'enregistrer le document"}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const resetForm = () => {
    setFormData({
      ownerName: "",
      documentType: "",
      documentContent: "",
      institution: ""
    });
    setDocumentHash("");
    setTransactionHash("");
  };

  const verificationUrl = `${window.location.origin}/verification?hash=${documentHash}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Enregistrer un Document sur la Blockchain
          </DialogTitle>
        </DialogHeader>
        
        {/* Statut MetaMask */}
        {!isConnected && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ Veuillez connecter votre wallet MetaMask pour enregistrer un document sur la blockchain.
              </p>
            </CardContent>
          </Card>
        )}

        {isConnected && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-green-800 text-sm">
                ✅ Wallet connecté : {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </CardContent>
          </Card>
        )}
        
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Informations du document */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Nom du propriétaire *</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                placeholder="Ex: Jean Kabila Kabange"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="institution">Institution émettrice</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                placeholder="Ex: Université de Kinshasa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Type de document *</Label>
            <Select onValueChange={(value) => handleInputChange("documentType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diplome">Diplôme</SelectItem>
                <SelectItem value="certificat">Certificat</SelectItem>
                <SelectItem value="titre_foncier">Titre Foncier</SelectItem>
                <SelectItem value="attestation">Attestation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentContent">Contenu du document</Label>
            <Textarea
              id="documentContent"
              value={formData.documentContent}
              onChange={(e) => handleInputChange("documentContent", e.target.value)}
              placeholder="Détails du document (titre, spécialité, mentions, etc.)"
              rows={4}
            />
          </div>

          {/* Génération de hash */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Hash du document</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateHash}
                    className="flex items-center"
                  >
                    <Hash className="w-4 h-4 mr-1" />
                    Générer Hash
                  </Button>
                </div>
                
                {documentHash && (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded border font-mono text-sm break-all">
                      {documentHash}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {documentHash && (
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <h4 className="font-medium mb-3">QR Code de vérification</h4>
                <div className="flex justify-center mb-3">
                  <QRCode value={verificationUrl} size={150} />
                </div>
                <p className="text-sm text-gray-600">
                  Scannez ce QR code pour vérifier le document
                </p>
              </CardContent>
            </Card>
          )}

          {transactionHash && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-green-800 mb-2">
                  Document enregistré avec succès !
                </h4>
                <p className="text-sm text-green-700 mb-2">
                  Hash de transaction:
                </p>
                <div className="p-2 bg-white rounded border font-mono text-xs break-all mb-3">
                  {transactionHash}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <a 
                    href={`${BLOCKCHAIN_CONFIG.BLOCK_EXPLORER}/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Voir sur PolygonScan
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => { resetForm(); onClose(); }}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isRegistering || !documentHash || !isConnected}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isRegistering ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Enregistrer sur Blockchain
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDocumentModal;
