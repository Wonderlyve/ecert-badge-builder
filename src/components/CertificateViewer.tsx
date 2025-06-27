
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Certificate {
  id: string;
  recipientName: string;
  course: string;
  issueDate: string;
  status: string;
  organization: string;
  skills: string[];
}

interface CertificateViewerProps {
  certificate: Certificate;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateViewer = ({ certificate, isOpen, onClose }: CertificateViewerProps) => {
  const handleDownload = () => {
    toast({
      title: "Téléchargement en cours",
      description: "Le certificat PDF est en cours de génération...",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://ecert.app/verify/${certificate.id}`);
    toast({
      title: "Lien copié",
      description: "Le lien de vérification a été copié dans le presse-papiers.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Certificate Display */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
            
            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificat de Réussite</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>

            {/* Content */}
            <div className="text-center mb-8 relative z-10">
              <p className="text-lg text-gray-600 mb-4">Il est certifié par la présente que</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{certificate.recipientName}</h2>
              <p className="text-lg text-gray-600 mb-2">a suivi avec succès la formation</p>
              <h3 className="text-2xl font-semibold text-blue-700 mb-6">{certificate.course}</h3>
              
              {/* Skills */}
              {certificate.skills.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Compétences acquises :</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {certificate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end relative z-10">
              <div className="text-left">
                <p className="text-sm text-gray-600">Émis par</p>
                <p className="font-semibold text-gray-900">{certificate.organization}</p>
                <p className="text-sm text-gray-500">
                  Date d'émission : {new Date(certificate.issueDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">Certificat Valide</Badge>
                </div>
                <p className="text-xs text-gray-500">ID : {certificate.id}</p>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-xs text-gray-500 text-center">QR<br/>Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Certificat vérifié • Émis le {new Date(certificate.issueDate).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
            <Button 
              onClick={handleDownload}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateViewer;
