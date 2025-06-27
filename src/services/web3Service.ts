
import { ethers } from 'ethers';
import ContractABI from '../abis/DocumentCertifier.json';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';

let provider: ethers.providers.JsonRpcProvider;
let contract: ethers.Contract;

// Initialisation du provider et du contrat
export const initializeWeb3 = () => {
  provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);
  contract = new ethers.Contract(BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS, ContractABI.abi, provider);
};

// Connecter MetaMask et retourner le signer
export const getMetaMaskSigner = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask n\'est pas installé');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    
    // Vérifier si on est sur Mumbai
    const network = await web3Provider.getNetwork();
    if (network.chainId !== BLOCKCHAIN_CONFIG.NETWORK_ID) {
      throw new Error(`Veuillez vous connecter au réseau ${BLOCKCHAIN_CONFIG.NETWORK_NAME}`);
    }
    
    return signer;
  } catch (error) {
    console.error('Erreur de connexion au wallet:', error);
    throw error;
  }
};

// Enregistrer un document sur la blockchain avec un signer fourni
export const registerDocument = async (hash: string, ownerName: string, docType: string, signerProvided?: ethers.Signer) => {
  try {
    // Utiliser le signer fourni ou obtenir un nouveau signer
    const signer = signerProvided || await getMetaMaskSigner();
    
    // Initialiser le contrat si ce n'est pas déjà fait
    if (!contract) {
      initializeWeb3();
    }
    
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
