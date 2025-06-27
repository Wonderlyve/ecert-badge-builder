
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  Shield,
  Clock,
  Banknote,
  Receipt,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fee: string;
  processingTime: string;
  available: boolean;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

const PaymentPage = () => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const services: ServiceOption[] = [
    {
      id: 'verification_basic',
      name: 'Vérification Basique',
      description: 'Vérification simple d\'un document',
      price: 500,
      currency: 'CDF',
      features: [
        'Vérification d\'authenticité',
        'Statut du document',
        'Informations de base'
      ]
    },
    {
      id: 'verification_advanced',
      name: 'Vérification Avancée',
      description: 'Vérification complète avec rapport détaillé',
      price: 1500,
      currency: 'CDF',
      features: [
        'Vérification d\'authenticité',
        'Statut du document',
        'Rapport détaillé PDF',
        'Historique complet',
        'Certificat de vérification'
      ],
      popular: true
    },
    {
      id: 'attestation',
      name: 'Attestation Officielle',
      description: 'Génération d\'une attestation de vérification',
      price: 3000,
      currency: 'CDF',
      features: [
        'Attestation officielle',
        'Signature numérique',
        'Cachet électronique',
        'Valeur légale',
        'Archivage sécurisé'
      ]
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      icon: <Smartphone className="w-6 h-6 text-red-600" />,
      description: 'Paiement mobile Airtel',
      fee: '0%',
      processingTime: 'Instantané',
      available: true
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <Smartphone className="w-6 h-6 text-green-600" />,
      description: 'Vodacom M-Pesa',
      fee: '1%',
      processingTime: 'Instantané',
      available: true
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: <Smartphone className="w-6 h-6 text-orange-600" />,
      description: 'Paiement Orange Money',
      fee: '0.5%',
      processingTime: 'Instantané',
      available: true
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
      description: 'Visa, MasterCard',
      fee: '3%',
      processingTime: '2-5 minutes',
      available: true
    }
  ];

  const handlePayment = async () => {
    if (!selectedService || !selectedPaymentMethod) {
      toast.error('Veuillez sélectionner un service et un mode de paiement');
      return;
    }

    setIsProcessing(true);
    
    // Simulation du processus de paiement
    toast.info('Redirection vers la plateforme de paiement...');
    
    setTimeout(() => {
      // Simuler le succès du paiement
      setIsProcessing(false);
      toast.success('Paiement effectué avec succès !');
      
      // Rediriger vers une page de confirmation ou de téléchargement
      setTimeout(() => {
        toast.info('Votre service sera disponible dans quelques instants.');
      }, 1000);
    }, 3000);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedPaymentData = paymentMethods.find(p => p.id === selectedPaymentMethod);

  const getTotalPrice = () => {
    if (!selectedServiceData || !selectedPaymentData) return 0;
    
    const basePrice = selectedServiceData.price;
    const feePercentage = parseFloat(selectedPaymentData.fee.replace('%', ''));
    const fee = (basePrice * feePercentage) / 100;
    
    return basePrice + fee;
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Services Payants
        </h1>
        <p className="text-gray-600">
          Accédez à nos services premium de vérification et certification
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection du service */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span>Choisissez votre service</span>
              </CardTitle>
              <CardDescription>
                Sélectionnez le type de vérification dont vous avez besoin
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`
                    relative p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${selectedService === service.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setSelectedService(service.id)}
                >
                  {service.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">
                      Populaire
                    </Badge>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg font-bold text-blue-600">
                            {service.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600">{service.currency}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      
                      <div className="space-y-1">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedService === service.id 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                      }
                    `}>
                      {selectedService === service.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sélection du mode de paiement */}
          {selectedService && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span>Mode de paiement</span>
                </CardTitle>
                <CardDescription>
                  Choisissez votre méthode de paiement préférée
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`
                      flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${selectedPaymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : method.available 
                          ? 'border-gray-200 hover:border-gray-300' 
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                      }
                    `}
                    onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {method.icon}
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{method.processingTime}</span>
                      </div>
                      <p className="text-xs">Frais: {method.fee}</p>
                    </div>
                    
                    <div className={`
                      ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${selectedPaymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                      }
                    `}>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Résumé de la commande */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-purple-600" />
                <span>Résumé</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {selectedServiceData ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="font-medium">{selectedServiceData.name}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix de base</span>
                      <span>{selectedServiceData.price.toLocaleString()} {selectedServiceData.currency}</span>
                    </div>
                    
                    {selectedPaymentData && selectedPaymentData.fee !== '0%' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frais ({selectedPaymentData.fee})</span>
                        <span>
                          {((selectedServiceData.price * parseFloat(selectedPaymentData.fee.replace('%', ''))) / 100).toLocaleString()} {selectedServiceData.currency}
                        </span>
                      </div>
                    )}
                    
                    <hr />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">
                        {getTotalPrice().toLocaleString()} {selectedServiceData.currency}
                      </span>
                    </div>
                  </div>

                  {selectedPaymentData && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        {selectedPaymentData.icon}
                        <span className="font-medium">{selectedPaymentData.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Temps de traitement: {selectedPaymentData.processingTime}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handlePayment}
                    disabled={!selectedService || !selectedPaymentMethod || isProcessing}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Traitement...
                      </div>
                    ) : (
                      <>
                        Procéder au paiement
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Sélectionnez un service pour voir le résumé</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Paiement sécurisé</span>
              </div>
              <p className="text-sm text-green-700">
                Toutes les transactions sont sécurisées et cryptées. 
                Vos informations bancaires ne sont jamais stockées.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
