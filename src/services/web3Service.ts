
import { ethers } from 'ethers';
import ContractABI from '../abis/DocumentCertifier.json';

// Configuration du contrat
const RPC_URL = 'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY';
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Remplacer par l'adresse réelle

let provider: ethers.providers.JsonRpcProvider;
let contract: ethers.Contract;

// Initialisation du provider et du contrat
export const initializeWeb3 = () => {
  provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, provider);
};

// Connecter MetaMask
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask n\'est pas installé');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    
    // Vérifier si on est sur Mumbai
    const network = await web3Provider.getNetwork();
    if (network.chainId !== 80001) {
      throw new Error('Veuillez vous connecter au réseau Polygon Mumbai');
    }
    
    return signer;
  } catch (error) {
    console.error('Erreur de connexion au wallet:', error);
    throw error;
  }
};

// Enregistrer un document sur la blockchain
export const registerDocument = async (hash: string, ownerName: string, docType: string) => {
  try {
    const signer = await connectWallet();
    const writeContract = contract.connect(signer);
    
    const tx = await writeContract.registerDocument(ownerName, hash, docType);
    await tx.wait();
    
    return {
      success: true,
      transactionHash: tx.hash,
      message: 'Document enregistré avec succès sur la blockchain'
    };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    throw error;
  }
};

// Vérifier un document sur la blockchain
export const verifyDocument = async (hash: string) => {
  try {
    initializeWeb3();
    const result = await contract.verifyDocument(hash);
    
    return {
      isValid: result[0],
      ownerName: result[1],
      documentType: result[2],
      timestamp: result[3].toNumber(),
      registrationDate: new Date(result[3].toNumber() * 1000).toISOString()
    };
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    throw error;
  }
};

// Générer le hash d'un document
export const generateDocumentHash = (data: string): string => {
  const CryptoJS = require('crypto-js');
  return CryptoJS.SHA256(data).toString();
};
