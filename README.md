# Betherscan
Betherscan is a browser extension designed to enhance the user experience on block explorer platforms. By integrating additional information directly into the pages, Betherscan aims to provide a more comprehensive view of blockchain data, making it easier for developers and advanced users to gather all the information they need without the need to navigate away from the explorer.

[![available in the chrome web store](https://github.com/tiagofneto/betherscan/assets/46165861/50947291-76c5-4b7e-8299-90332b21b8f6)](https://chromewebstore.google.com/detail/betherscan/nnahlkbepgjkeciakkhldbfgpfcgdhmb)


## Features
Betherscan adds new data fields to various sections of block explorers, detailed as follows:

### Blocks
- **Transactions root**: Root of the [transactions Trie](https://ethereum.org/developers/docs/data-structures-and-encoding/patricia-merkle-trie#transaction-trie)
- **Receipts root**: Root of the [receipts Trie](https://ethereum.org/developers/docs/data-structures-and-encoding/patricia-merkle-trie#receipts-trie)
- **Mix hash**: Used to verify the correctness of a block's Proof of Work. In Proof of Stake consensus, corresponds to the _RANDAO_ value of the previous Beacon Chain block
- **Logs Bloom**: [Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter) of indexable information from the logs entry of the transactions receipts
- **Header RLP**: [RLP](https://ethereum.org/developers/docs/data-structures-and-encoding/rlp) encoded block header

### Accounts
#### Smart Contracts
- **Storage root**: Root of the [storage Trie](https://ethereum.org/developers/docs/data-structures-and-encoding/patricia-merkle-trie#storage-trie)
- **Code hash**: Keccak256 hash of the EVM code of the account

#### EOAs
- **Nonce**: Number of transactions sent

### Transactions
- **Signature (v, r, s)**: Components of the digital signature ([ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)) of the transaction

## Supported explorers
- [Etherscan](https://etherscan.io)

## Disclaimer
This extension is an independent project and has not been authorized, sponsored, or otherwise approved by any block explorer platforms. It is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose. Use it at your own risk.
