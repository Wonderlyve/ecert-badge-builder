
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import DocumentsPage from '@/pages/DocumentsPage';
import VerificationPage from '@/pages/VerificationPage';
import ScanPage from '@/pages/ScanPage';
import PaymentPage from '@/pages/PaymentPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Hook pour la gestion MetaMask
const useMetaMask = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Vérifier si MetaMask est installé
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Connecter MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error("MetaMask n'est pas installé ! Veuillez l'installer depuis https://metamask.io/");
      return;
    }

    try {
      // Demander l'autorisation de connexion
      await window.ethereum!.request({ method: 'eth_requestAccounts' });
      
      // Créer le provider Web3
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum!);
      
      // Récupérer le signer
      const walletSigner = web3Provider.getSigner();
      setSigner(walletSigner);
      
      // Récupérer l'adresse du wallet
      const address = await walletSigner.getAddress();
      setWalletAddress(address);
      setIsConnected(true);
      
      toast.success(`✅ Wallet connecté : ${address.slice(0, 6)}...${address.slice(-4)}`);
      
    } catch (error: any) {
      console.error('Erreur de connexion MetaMask:', error);
      toast.error(`Erreur: ${error.message || 'Impossible de connecter MetaMask'}`);
    }
  };

  // Déconnecter le wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setSigner(null);
    toast.info("Wallet déconnecté");
  };

  // Vérifier la connexion au chargement
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum!);
            const walletSigner = web3Provider.getSigner();
            const address = await walletSigner.getAddress();
            
            setWalletAddress(address);
            setIsConnected(true);
            setSigner(walletSigner);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de connexion:', error);
        }
      }
    };

    checkConnection();
  }, []);

  return {
    walletAddress,
    isConnected,
    signer,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled
  };
};

// Composant pour afficher le statut MetaMask
const MetaMaskStatus = () => {
  const { walletAddress, isConnected, connectWallet, disconnectWallet, isMetaMaskInstalled } = useMetaMask();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {!isMetaMaskInstalled() && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          MetaMask non installé
        </Badge>
      )}
      
      {isConnected ? (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-600 text-white flex items-center gap-1">
            <Wallet className="w-3 h-3" />
            ✅ {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={disconnectWallet}
            className="text-xs"
          >
            Déconnecter
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          onClick={connectWallet}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
          disabled={!isMetaMaskInstalled()}
        >
          <Wallet className="w-4 h-4" />
          🔗 Connecter MetaMask
        </Button>
      )}
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />
      <Route path="/verification" element={<VerificationPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/documents" element={
        <ProtectedRoute>
          <DocumentsPage />
        </ProtectedRoute>
      } />
      <Route path="/scan" element={
        <ProtectedRoute>
          <ScanPage />
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute>
          <PaymentPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 relative">
            <MetaMaskStatus />
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
