# Voting DApp
**Application décentralisé d'un système de vote sur la blockchain Ethereum pour le projet 3 d'Alyra.**

Celle ci doit permettre :
- [x] l’enregistrement d’une liste blanche d'électeurs. 
- [x] à l'administrateur de commencer la session d'enregistrement de la proposition.
- [x] aux électeurs inscrits d’enregistrer leurs propositions.
- [x] à l'administrateur de mettre fin à la session d'enregistrement des propositions.
- [x] à l'administrateur de commencer la session de vote.
- [x] aux électeurs inscrits de voter pour leurs propositions préférées.
- [x] à l'administrateur de mettre fin à la session de vote.
- [x] à l'administrateur de comptabiliser les votes.
- [x] à tout le monde de consulter le résultat.

Le contrat est déployé sur le testnet Ropsten à l'adresse : [0x03F1F7569cE9aE06920f1b70be513D7A713613](https://ropsten.etherscan.io/address/0x03F1F7569cE9aE06920f1b70be513D7A71361334)

Hebergé sur Heroku : https://shielded-coast-66343.herokuapp.com/

Présentation en vidéo : https://www.loom.com/share/2e231f64220d4e39945bd74f852b57d9

## Modifications apportées
Le contrat a été modifié pour être protégé du Dos gas limit.

J'ai rajouté un require limitant l'ajout de propopositions à 100. De ce fait un attaquant ne pourrait plus remplir un tableau de propositions justqu'à ce qu'il ne soit plus possible de boucler dessus.
```javascript
  function addProposal(string memory _desc) external onlyVoters {
    require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
    require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
    require(proposalsArray.length <= 100, "The limit of proposals has been reached"); // Dos protection
    // voir que desc est different des autres

    Proposal memory proposal;
    proposal.description = _desc;
    proposalsArray.push(proposal);
    emit ProposalRegistered(proposalsArray.length-1, _desc);
  }

```