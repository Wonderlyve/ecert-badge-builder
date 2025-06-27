
// Configuration pour la blockchain Polygon Mumbai
export const BLOCKCHAIN_CONFIG = {
  RPC_URL: 'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY',
  CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890', // À remplacer
  NETWORK_ID: 80001,
  NETWORK_NAME: 'Polygon Mumbai Testnet',
  BLOCK_EXPLORER: 'https://mumbai.polygonscan.com'
};

// Instructions pour la configuration
export const SETUP_INSTRUCTIONS = `
Pour configurer l'intégration blockchain :

1. Créez un compte sur Infura (https://infura.io)
2. Créez un nouveau projet Polygon
3. Remplacez YOUR_INFURA_KEY dans la configuration
4. Déployez le contrat DocumentCertifier sur Mumbai
5. Mettez à jour CONTRACT_ADDRESS avec l'adresse réelle

Smart Contract Solidity à déployer :
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
`;
