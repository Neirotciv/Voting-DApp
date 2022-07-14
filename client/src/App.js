import React, { useEffect, useState, useContext } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./scripts/getWeb3";
// import Voter from "./components/Voter";
// import Owner from "./components/Owner";

import "./App.css";

// COMPONENTS

function WorkflowStatus(props) {
    const [status, setStatus] = useState(null);
    const contract = useContext(ContractContext);
    
    async function getCurrentStatus() {
        try {
            const status = await contract.methods.workflowStatus().call({ from: "0x4E90a36B45879F5baE71B57Ad525e817aFA54890" });
            setStatus(status);
        } catch (error) {
            console.error("getCurrentStatus", error);
        }
    }

    getCurrentStatus();
    
    return (
        <div>
            workflowstatus {status}
        </div>
    )
}

function ChangeWorkflowStatus() {
    const contract = useContext(ContractContext);

    // async function getStatus() {
    //     if (contract) {
    //         const status = await contract.methods.workflowStatus().call({ from: props.address });
    //         setStatus(status);
    //     }
    // }

    // function updatePreviousNextStatusInFront(transaction) {
    //     const workflowStatus = [
    //         transaction.events.WorkflowStatusChange.returnValues.previousStatus,
    //         transaction.events.WorkflowStatusChange.returnValues.newStatus
    //     ];
    //     setworkflowStatusEvent(workflowStatus);
    // }

    // async function startProposalsRegistering() {
    //     try {
    //         const transaction = await contract.methods.startProposalsRegistering().send({ from: props.address });
    //         updatePreviousNextStatusInFront(transaction);
    //         const status = await contract.methods.workflowStatus().call({ from: props.address });
    //         setStatus(status);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async function endProposalsRegistering() {
    //     try {
    //         const transaction = await contract.methods.endProposalsRegistering().send({ from: props.address });
    //         updatePreviousNextStatusInFront(transaction);
    //         const status = await contract.methods.workflowStatus().call({ from: props.address });
    //         setStatus(status);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async function startVotingSession() {
    //     try {
    //         const transaction = await contract.methods.startVotingSession().send({ from: props.address });
    //         updatePreviousNextStatusInFront(transaction);
    //         const status = await contract.methods.workflowStatus().call({ from: props.address });
    //         setStatus(status);
    //     } catch (error) {
    //         console.log(error);
    //     } 
    // }

    // async function endVotingSession() {
    //     try {
    //         const transaction = await contract.methods.endVotingSession().send({ from: props.address });
    //         updatePreviousNextStatusInFront(transaction);
    //         const status = await contract.methods.workflowStatus().call({ from: props.address });
    //         setStatus(status);
    //     } catch (error) {
    //         console.log(error);
    //     } 
    // }

    // async function tallyVotes() {
    //     try {
    //         const transaction = await contract.methods.tallyVotes().send({ from: props.address });
    //         updatePreviousNextStatusInFront(transaction);
    //         const status = await contract.methods.workflowStatus().call({ from: props.address });
    //         setStatus(status);
    //     } catch (error) {
    //         console.log(error);
    //     } 
    // }
    // return (
    //     <div className="container">
    //         <div>Previous status : </div>
    //         <div>New status : </div>
    //         <button onClick={startProposalsRegistering}>1 - Start proposals registering</button>
    //         <button onClick={endProposalsRegistering}>2 - End proposals registering</button>
    //         <button onClick={startVotingSession}>3 - Start voting session</button>
    //         <button onClick={endVotingSession}>4 - End voting session</button>
    //         <button onClick={tallyVotes}>5 - Tally votes</button>
    //     </div>
    // )
}

function Header(props) {
    return (
        <div>
            <div id="contract">Contract: {props.contractAddress}</div>
            <div id="account">Account: {props.accountAddress}</div>
            <WorkflowStatus contract={props.contract} accoundAddress={props.accountAddress} />
        </div>
    )
}

function Owner() {
    return (
        <div>
            <h1>Owner</h1>
            <ChangeWorkflowStatus />
        </div>
    )
}

function Voter() {
    return (
        <div>
            <h1>Voter</h1>
        </div>
    )
}

const ContractContext = React.createContext();

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [owner, setOwner] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

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
                setContractAddress(contractAddress)

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
            return <Owner />;
        }
        return <Voter />;
    }

    if (!web3 && !contract) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <div>
            <ContractContext.Provider value={contract}>
                <Header contractAddress={contractAddress} accountAddress={accounts} contract={contract} />
                <UserDashboard isOwner={isOwner} />
            </ContractContext.Provider>
        </div>
    )
}

export default App;