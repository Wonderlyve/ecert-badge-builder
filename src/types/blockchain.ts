
export interface Document {
  hash: string;
  ownerName: string;
  documentType: string;
  timestamp: number;
  isRegistered: boolean;
  institution?: string;
  content?: string;
}

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  gasUsed: string;
  status: number;
}

export interface VerificationResult {
  isValid: boolean;
  ownerName: string;
  documentType: string;
  timestamp: number;
  registrationDate: string;
  blockchainVerified: boolean;
}

export interface Web3Error {
  code: number;
  message: string;
  data?: any;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
