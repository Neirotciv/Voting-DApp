import React, { useEffect, useState } from "react";
import Voting from "./Voting";
import Proposals from "./Proposals";

function Voter(props) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [workflowStatus, setworkflowStatus] = useState(0);
    const [contract, setContract] = useState(props.contract);
    const [id, setId] = useState(null);

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
            const idEvent = transaction.events.ProposalRegistered.returnValues.proposalId;
            setId(idEvent);
        } catch (error) {
            console.log("add proposal", error)
        }
    }

    function AddProposal() {
        if (workflowStatus === "1") {
            return (
                <div className="window">
                    <h3>Add you're proposal</h3>
                    <input id="proposal-description" type="text" placeholder="Description..." />
                    <button onClick={addProposal}>Validate</button>
                    {(id === null ? "" : <p className="good">Proposal id {id} just recorded</p>)}
                </div>
            )
        }
        return <div className="window"><h3>The proposal session is finished or not yet open</h3></div>
    }

    function inputIfRegistered() {
        if (isRegistered) {
            return (
                <div>
                    <AddProposal isRegistered={isRegistered} />
                    {workflowStatus === "3" ? <Voting userAccount={props.userAccount} contract={props.contract} /> : "" }
                </div>
            )
        }
    }

    return (
        <div>
            <div className="window">
                <h2>Voter - {(isRegistered ? "you are registered" : "you are not registered")}</h2>
            </div>
            {inputIfRegistered()}
            <Proposals contract={props.contract} />
        </div>
        
    )
}

export default Voter;