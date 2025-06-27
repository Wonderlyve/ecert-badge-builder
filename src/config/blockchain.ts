
// Configuration pour la blockchain Polygon Mumbai
export const BLOCKCHAIN_CONFIG = {
  RPC_URL: 'https://polygon-mumbai.infura.io/v3/0dc22238a555458cbf55772d6212aacb',
  CONTRACT_ADDRESS: '0xECertDemo20250627112419',
  NETWORK_ID: 80001,
  NETWORK_NAME: 'Polygon Mumbai Testnet',
  BLOCK_EXPLORER: 'https://mumbai.polygonscan.com'
};

// Instructions pour la configuration
export const SETUP_INSTRUCTIONS = `
Configuration blockchain intégrée :

1. RPC URL: ${BLOCKCHAIN_CONFIG.RPC_URL}
2. Adresse du contrat: ${BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS}
3. Réseau: ${BLOCKCHAIN_CONFIG.NETWORK_NAME}
4. Explorateur: ${BLOCKCHAIN_CONFIG.BLOCK_EXPLORER}

Smart Contract Solidity déployé :
----------------------------------------
pragma solidity ^0.8.0;

contract DocumentCertifier {
    struct Document {
        string ownerName;
        string documentType;
        uint256 timestamp;
        bool isRegistered;
    }
    
    mapping(string => Document) public documents;
    
    event DocumentRegistered(string indexed documentHash, string ownerName, string documentType);
    
    function registerDocument(string memory _ownerName, string memory _documentHash, string memory _documentType) public {
        require(!documents[_documentHash].isRegistered, "Document already registered");
        
        documents[_documentHash] = Document({
            ownerName: _ownerName,
            documentType: _documentType,
            timestamp: block.timestamp,
            isRegistered: true
        });
        
        emit DocumentRegistered(_documentHash, _ownerName, _documentType);
    }
    
    function verifyDocument(string memory _documentHash) public view returns (bool, string memory, string memory, uint256) {
        Document memory doc = documents[_documentHash];
        return (doc.isRegistered, doc.ownerName, doc.documentType, doc.timestamp);
    }
}

Vérifiez le contrat sur: ${BLOCKCHAIN_CONFIG.BLOCK_EXPLORER}/address/${BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS}
`;
