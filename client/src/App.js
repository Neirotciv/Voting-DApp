import React, { useEffect, useState, useContext } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./scripts/getWeb3";
import Voter from "./components/Voter";
import AddVoter from "./components/AddVoter";
import Header from "./components/Header";
// import Owner from "./components/Owner";

// Eléments de notation

// Revoir le code sol pour enlever la faille de sécurité, ajouter les commentaires et les
// éléments de bonnes pratiques
// (si vous n'utilisez pas le code proposé en correction, veuillez faire attention à la
// sécurité, aux optimisations, aux commentaires, aux bonnes pratiques...)
// avoir une application décentralisée qui permet d'appeler toutes les fonctions
// faire une vidéo du workflow
// une utilisation d'event
// afficher le compte utilisé, et les proposals

// déployer l'application sur serveur public
// un affichage adapté au compte utilisé,
// utiliser au moins un composant utile (pas juste l'adresse)

import "./App.css";

// ====================================
// ---------- WORKFLOWSTATUS ----------
// ====================================

function ChangeWorkflowStatus(props) {
    const [status, setStatus] = useState(null);
    const contract = useContext(ContractContext);
    const [workflowStatusEvent, setworkflowStatusEvent] = useState(null);
    const [winningProposal, setWinningProposal] = useState(null);
   
    async function updateStatus() {
        if (contract) {
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            setStatus(status);
            const winningProposalID = await contract.methods.winningProposalID().call({ from: props.userAccount });
            setWinningProposal(winningProposalID);
        }
    }

    window.onload = updateStatus();
    
    function updatePreviousNextStatusInFront(transaction) {
        const workflowStatus = [
            transaction.events.WorkflowStatusChange.returnValues.previousStatus,
            transaction.events.WorkflowStatusChange.returnValues.newStatus
        ];
        setworkflowStatusEvent(workflowStatus);
    }

    async function startProposalsRegistering() {
        try {
            const transaction = await contract.methods.startProposalsRegistering().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            updateStatus(status);
        } catch (error) {
            console.log(error);
        }
    }

    async function endProposalsRegistering() {
        try {
            const transaction = await contract.methods.endProposalsRegistering().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            updateStatus(status);
        } catch (error) {
            console.log(error);
        }
    }

    async function startVotingSession() {
        try {
            const transaction = await contract.methods.startVotingSession().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            updateStatus(status);
        } catch (error) {
            console.log(error);
        } 
    }

    async function endVotingSession() {
        try {
            const transaction = await contract.methods.endVotingSession().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            updateStatus(status);
        } catch (error) {
            console.log(error);
        } 
    }

    async function tallyVotes() {
        try {
            const transaction = await contract.methods.tallyVotes().send({ from: props.userAccount });
            // updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            const winningProposalID = await contract.methods.winningProposalID().call({ from: props.userAccount });
            setWinningProposal(winningProposalID);
            updateStatus(status);
        } catch (error) {
            console.log(error);
        } 
    }

    return (
        <div className="window">
            <div>Workflow status id : {status}</div>
            <div>Previous status : </div>
            <div>New status : </div><br/>
            <div>Winner is {winningProposal}</div>
            
            <div className="form">
                <button onClick={startProposalsRegistering}>1 - Start proposals registering</button>
                <button onClick={endProposalsRegistering}>2 - End proposals registering</button>
                <button onClick={startVotingSession}>3 - Start voting session</button>
                <button onClick={endVotingSession}>4 - End voting session</button>
                <button onClick={tallyVotes}>5 - Tally votes</button> 
            </div>
           
        </div>
    )
}

// ===========================
// ---------- OWNER ----------
// ===========================

function Owner(props) {
    return (
        <div>
            <div className="window">
                <h2>Owner</h2>
            </div>
            <ChangeWorkflowStatus userAccount={props.userAccount} />
            <AddVoter userAccount={props.userAccount} contract={props.contract} />
        </div>
    )
}

// =========================
// ---------- APP ----------
// =========================

const ContractContext = React.createContext();

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [owner, setOwner] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [userAccount, setUserAccount] = useState(null);

    useEffect(() => {
        async function setUpWeb3() {
            try {
                const web3Provider = await getWeb3();
                const accounts = await web3Provider.eth.getAccounts();
                const networkId = await web3Provider.eth.net.getId();
                const deployedNetwork = VotingContract.networks[networkId];
                const instance = await new web3Provider.eth.Contract(
                    VotingContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                const contractOwner = await instance.methods.owner().call();
                const contractAddress = await instance.options.address;
                
                if (accounts[0] === contractOwner) { setIsOwner(true) }
                setWeb3(web3Provider);
                setContract(instance);
                setAccounts(accounts);
                setOwner(contractOwner);
                setContractAddress(contractAddress);
                setUserAccount(accounts[0]);

                
            } catch (error) {
                alert("Failed to load web3, accounts, or contract. Check console for details");
                console.error(error);
            }
        }
        
        setUpWeb3();
    },[]);

    function UserDashboard(props) {
        if (props.userAccount) {
            if (isOwner) {
                return <Owner userAccount={props.userAccount} contract={props.contract} />;
            }
            return <Voter userAccount={props.userAccount} contract={props.contract} />;
        }
    }

    if (!web3 && !contract) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div className="wrapper">
            <ContractContext.Provider value={contract}>
                <Header contractAddress={contractAddress} userAccount={userAccount} contract={contract} />
                <UserDashboard isOwner={isOwner} userAccount={userAccount} contract={contract} />
            </ContractContext.Provider>
        </div>
    )
}

export default App;