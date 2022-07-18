import React, { useEffect, useState, useContext } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./scripts/getWeb3";
import Voter from "./components/Voter";
import AddVoter from "./components/AddVoter";
import Header from "./components/Header";
import Proposals from "./components/Proposals";
// import Winning from "./components/Proposals";

// avoir une application décentralisée qui permet d'appeler toutes les fonctions
// faire une vidéo du workflow
// déployer l'application sur serveur public

import "./App.css";

// ====================================
// ---------- WORKFLOWSTATUS ----------
// ====================================

function ChangeWorkflowStatus(props) {
    const contract = useContext(ContractContext);
    const [workflowStatusEvent, setworkflowStatusEvent] = useState([0, 0]);
    const [winningProposal, setWinningProposal] = useState(null);
   
    async function updateStatus() {
        if (contract) {
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
        console.log(workflowStatus);
        setworkflowStatusEvent(workflowStatus);
    }

    async function startProposalsRegistering() {
        try {
            const transaction = await contract.methods.startProposalsRegistering().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
        } catch (error) {
            console.error("start proposals registering", error);
        }
    }

    async function endProposalsRegistering() {
        try {
            const transaction = await contract.methods.endProposalsRegistering().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
        } catch (error) {
            console.log(error);
        }
    }

    async function startVotingSession() {
        try {
            const transaction = await contract.methods.startVotingSession().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
        } catch (error) {
            console.log(error);
        } 
    }

    async function endVotingSession() {
        try {
            const transaction = await contract.methods.endVotingSession().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
        } catch (error) {
            console.log(error);
        } 
    }

    async function tallyVotes() {
        try {
            const transaction = await contract.methods.tallyVotes().send({ from: props.userAccount });
            updatePreviousNextStatusInFront(transaction);
            const winningProposalID = await contract.methods.winningProposalID().call({ from: props.userAccount });
            setWinningProposal(winningProposalID);
        } catch (error) {
            console.log(error);
        } 
    }

    return (
        <div className="window">
            <h3>Previous status : {workflowStatusEvent[0]} - New status : {workflowStatusEvent[1]}</h3>
            <h3>Winner is {winningProposal}</h3>
            
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
            <Proposals contract={props.contract} />
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