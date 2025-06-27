
import CryptoJS from 'crypto-js';

export const generateDocumentHash = (rawData: string): string => {
  return CryptoJS.SHA256(rawData).toString();
};

export const hashDocumentData = (data: {
  ownerName: string;
  documentType: string;
  documentContent: string;
  institution?: string;
  timestamp?: number;
}): string => {
  const dataToHash = JSON.stringify({
    ...data,
    timestamp: data.timestamp || Date.now()
  });
  
  return generateDocumentHash(dataToHash);
};
