
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export const useMetaMask = () => {
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
      
      return walletSigner;
      
    } catch (error: any) {
      console.error('Erreur de connexion MetaMask:', error);
      toast.error(`Erreur: ${error.message || 'Impossible de connecter MetaMask'}`);
      return null;
    }
  };

  // Déconnecter le wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setSigner(null);
    toast.info("Wallet déconnecté");
  };

  // Obtenir le signer actuel ou se connecter
  const getSigner = async () => {
    if (signer) {
      return signer;
    }
    return await connectWallet();
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
    getSigner,
    isMetaMaskInstalled
  };
};
