
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Award, Search, Filter, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import CreateCertificateModal from "@/components/CreateCertificateModal";
import CertificateViewer from "@/components/CertificateViewer";

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Données d'exemple
  const certificates = [
    {
      id: "CERT-2024-001",
      recipientName: "Marie Dubois",
      course: "Développement Web Avancé",
      issueDate: "2024-01-15",
      status: "valid",
      organization: "TechAcademy France",
      skills: ["React", "TypeScript", "Node.js"]
    },
    {
      id: "CERT-2024-002",
      recipientName: "Pierre Martin",
      course: "Cybersécurité Fondamentale",
      issueDate: "2024-01-20",
      status: "valid",
      organization: "CyberInstitut",
      skills: ["Sécurité", "Réseaux", "Cryptographie"]
    },
    {
      id: "CERT-2024-003",
      recipientName: "Sophie Bernard",
      course: "Data Science & IA",
      issueDate: "2024-01-25",
      status: "pending",
      organization: "DataLab",
      skills: ["Python", "Machine Learning", "SQL"]
    }
  ];

  const stats = [
    { title: "Certificats émis", value: "1,247", icon: Award, color: "text-blue-600" },
    { title: "Certificats actifs", value: "1,189", icon: Award, color: "text-green-600" },
    { title: "En attente", value: "58", icon: Award, color: "text-orange-600" },
  ];

  const filteredCertificates = certificates.filter(cert =>
    cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">eCert</h1>
                <p className="text-sm text-gray-500">Certification Numérique</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Certificat
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="bg-white shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, cours ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certificates List */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certificats Récents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredCertificates.map((cert) => (
                <div key={cert.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{cert.recipientName}</h3>
                        <Badge 
                          variant={cert.status === 'valid' ? 'default' : 'secondary'}
                          className={cert.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                        >
                          {cert.status === 'valid' ? 'Valide' : 'En attente'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-1">{cert.course}</p>
                      <p className="text-sm text-gray-500">ID: {cert.id} • Émis le {new Date(cert.issueDate).toLocaleDateString('fr-FR')}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cert.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCertificate(cert)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Modals */}
      <CreateCertificateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      {selectedCertificate && (
        <CertificateViewer 
          certificate={selectedCertificate}
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default Index;
