import React, { useEffect, useState } from "react";
import Voting from "./Voting";
import Proposals from "./Proposals";
import Winning from "./Winning";

function Voter(props) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [workflowStatus, setworkflowStatus] = useState(0);
    const [contract, setContract] = useState(props.contract);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        setContract(props.contract);
        checkIfUserIsRegistered();
        checkWorkflowStatus();
    },[props.contract]);

    // Je veux vérifier si user est registered
    contract.events.VoterRegistered({ fromBlock: "latest" }) 
        .on('data', event => {
            if (event.returnValues.voterAddress === props.userAccount) {
                setIsRegistered(true)
            }
        })
    
        // Je veux récupérer le workflowstatus actuel
    contract.events.WorkflowStatusChange({ fromBlock: "latest" }) 
        .on('data', event => {
            let newStatus = event.returnValues.newStatus;
            setworkflowStatus(newStatus);
        })
   
    
    async function checkIfUserIsRegistered() {
        if (contract && props.userAccount) {
            const user = await contract.methods.getVoter(props.userAccount).call({ from: props.userAccount });
            setIsRegistered(user.isRegistered);
        }
    }

    async function checkWorkflowStatus() {
        if (contract && props.userAccount) {
            const status = await contract.methods.workflowStatus().call({ from: props.userAccount });
            setworkflowStatus(status);
        }
    }

    async function addProposal() {
        const element = document.getElementById("proposal-description");
        const description = element.value;
        try {
            const transaction = await contract.methods.addProposal(description).send({ from: props.userAccount });
            const event = transaction.events.ProposalRegistered.returnValues.proposalId;
            setEvent(event);
        } catch (error) {
            console.log("add proposal", error)
        }
    }

    function AddProposal() {
        if (workflowStatus === "1") {
            return (
                <div className="window">
                    <h3>Add you're proposal</h3>
                    <input className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" id="proposal-description" type="text" placeholder="Description..." />
                    <button onClick={addProposal}>Validate</button>
                    {(event === null ? "" : <p>Proposal id {event} just recorded</p>)}
                </div>
            )
        }
        return <div className="window"><h3>The proposal session is finished or not yet open</h3></div>
    }

    function inputAddProposal() {
        if (isRegistered) {
            return (
                <div>
                    <AddProposal />
                </div>
            )
        }
    }

    return (
        <div>
            <div className="window">
                <h2>Voter - {(isRegistered ? "you are registered" : "you are not registered")}</h2>
            </div>
            {inputAddProposal()}
            <Winning userAccount={props.userAccount} workflowStatus={workflowStatus} contract={props.contract} />
            <Voting userAccount={props.userAccount} contract={props.contract} />
            <Proposals contract={props.contract} />
        </div>
        
    )
}

export default Voter;