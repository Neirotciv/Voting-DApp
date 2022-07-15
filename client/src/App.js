import React, { useEffect, useState, useContext } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./scripts/getWeb3";
// import Voter from "./components/Voter";
// import Owner from "./components/Owner";

import "./App.css";

// ====================================
// ---------- WORKFLOWSTATUS ----------
// ====================================

function WorkflowStatus(props) {
    const [status, setStatus] = useState(0);
    const [stringStatus, setStringStatus] = useState("Registering voters");
    const contract = useContext(ContractContext);

    async function updateStatus() {
        if (contract) {
            const statusId = await contract.methods.workflowStatus().call({ from: props.userAccount });
            setStatus(statusId);
            stringStatusFromId(statusId)
        }
    }
    function stringStatusFromId(id) {
        switch (id) {
            case "0":
                setStringStatus("Registering voters");
                break;
            case "1":
                setStringStatus("Proposals registration started");
                break;
            case "2":
                setStringStatus("Proposals registration ended");
                break;
            case "3":
                setStringStatus("Voting session started");
                break;
            case "4":
                setStringStatus("Voting session ended");
                break;
            case "5":
                setStringStatus("Votes tallied");
                break;
            default:
                setStringStatus("Status error");
        }
    }

    window.onload = updateStatus();
    
    return (
        <div>
            Workflowstatus : {stringStatus}
        </div>
    )
}

function ChangeWorkflowStatus(props) {
    const [status, setStatus] = useState(null);
    const contract = useContext(ContractContext);
    const [workflowStatusEvent, setworkflowStatusEvent] = useState(null);
    const [winningProposal, setWinningProposal] = useState(false);
   
    async function updateStatus() {
        if (contract) {
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            setStatus(status);
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
        console.log(props.userAccount)
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
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            const winningProposalID = await contract.methods.winningProposalID().call({ from: props.userAccount });
            setWinningProposal(winningProposalID);
            updateStatus(status);
        } catch (error) {
            console.log(error);
        } 
    }

    return (
        <div className="container">
            <WorkflowStatus userAccount={props.userAccount} />
            <div>Workflow status id : {status}</div>
            <div>Previous status : </div>
            <div>New status : </div><br/>
            
            <button onClick={startProposalsRegistering}>1 - Start proposals registering</button>
            <button onClick={endProposalsRegistering}>2 - End proposals registering</button>
            <button onClick={startVotingSession}>3 - Start voting session</button>
            <button onClick={endVotingSession}>4 - End voting session</button>
            <button onClick={tallyVotes}>5 - Tally votes</button>
        </div>
    )
}

// ================================
// ---------- ADD  VOTER ----------
// ================================
// 0xb6A8490101a0521677B66866B8052eE9f9975C17
// 0x301E1528bAD61177eF8Ff89bD4ad6760581e5409

function AddVoter(props) {
    const [event, setEvent] = useState(null);
    const contract = useContext(ContractContext);

    async function addNewVoter() {
        const element = document.getElementById("new-voter-address");
        const voterToAdd = element.value;
        let transaction;

        try {
            // Récupérer l'évenement dans la transaction
            transaction = await contract.methods.addVoter(voterToAdd).send({ from: props.userAccount });
            const event = transaction.events.VoterRegistered.returnValues.voterAddress
            setEvent(event);
            console.log(event);
        } catch (error) {
            console.log(error)
        }
        element.value = "";
    }

    return (
        <div className="container">
            <h3>Add new voter</h3>
            <input id="new-voter-address" type="text" placeholder="address 0x..." />
            <button onClick={addNewVoter}>Validate</button>
            {(event === null ? "" : <p>{event} just recorded</p>)}
        </div>
    )
}

// ============================
// ---------- HEADER ----------
// ============================

function Header(props) {
    return (
        <div className="header">
            <div id="contract">Contract: {props.contractAddress}</div>
            <div id="account">Account: {props.userAccount}</div>
        </div>
    )
}

// ===========================
// ---------- OWNER ----------
// ===========================

function Owner(props) {
    return (
        <div>
            <h1>Owner</h1>
            <ChangeWorkflowStatus userAccount={props.userAccount} />
            <AddVoter userAccount={props.userAccount} />
        </div>
    )
}

// ===========================
// ---------- VOTER ----------
// ===========================

function Voter(props) {
    const [isRegistered, setIsRegistered] = useState(false);
    const contract = useContext(ContractContext);

    useEffect(() => {
        getVoterFromAddress();
    })

    async function getVoterFromAddress() {
        if (contract && props.userAccount) {
            const transaction = await contract.methods.getVoter(props.userAccount).call({ from: props.userAccount });
            setIsRegistered(transaction.isRegistered)
        }
    }

    async function addProposal() {
        const element = document.getElementById("proposal-description");
        const description = element.value;
        try {
            const transaction = await contract.methods.addProposal(description).send({ from: props.userAccount });
            console.log(transaction);
        } catch (error) {
            console.log("add proposal", error)
        }
    }

    function inputAddProposal() {
        if (isRegistered) {
            return (
                <div className="container">
                    <h3>Add you're proposal</h3>
                    <input id="proposal-description" type="text" placeholder="Description..." />
                    <button onClick={addProposal}>Validate</button>
                    {/* {(event === null ? "" : <p>{event} just recorded</p>)} */}
                </div>
            )
        }
    }

    return (
        <div>
            <WorkflowStatus userAccount={props.userAccount} />
            <h1>Voter - {(isRegistered ? "you are registered" : "you are not registered")}</h1>
            {inputAddProposal()}
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

                setWeb3(web3Provider);
                setContract(instance);
                setAccounts(accounts);
                setOwner(contractOwner);
                setContractAddress(contractAddress);
                setUserAccount(accounts[0]);

                if (accounts[0] === contractOwner) { setIsOwner(true) }
                
            } catch (error) {
                alert("Failed to load web3, accounts, or contract. Check console for details");
                console.error(error);
            }
        }
        
        setUpWeb3();
    },[]);

    function UserDashboard(props) {

        if (props.isOwner) {
            return <Owner userAccount={props.userAccount} />;
        }
        return <Voter userAccount={props.userAccount} />;
    }

    if (!web3 && !contract) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div>
            <ContractContext.Provider value={contract}>
                <Header contractAddress={contractAddress} userAccount={userAccount} contract={contract} />
                <UserDashboard isOwner={isOwner} userAccount={userAccount} />
            </ContractContext.Provider>
        </div>
    )
}

export default App;