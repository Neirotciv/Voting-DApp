import React, { useState, useEffect } from "react";

function Owner(props) {
    const [contract, setContract] = useState(props.contract);
    const [status, setStatus] = useState(0);

    useEffect(() => {
        setContract(props.contract);
        getStatus();
    });

    async function getStatus() {
        if (contract) {
            const status = await contract.methods.workflowStatus().call({ from: props.address })
            setStatus(status);
            console.log(status);
        }
    }

    async function startProposalsRegistering() {
        contract.methods.startProposalsRegistering().send({ from: props.address });
        const status = await contract.methods.workflowStatus().call({ from: props.address });
        setStatus(1);
    }

    async function endProposalsRegistering() {
        contract.methods.endProposalsRegistering().send({ from: props.address });
        const status = await contract.methods.workflowStatus().call({ from: props.address });
        setStatus(2);
    }

    async function startVotingSession() {
        contract.methods.startVotingSession().send({ from: props.address });
        const status = await contract.methods.workflowStatus().call({ from: props.address });
        setStatus(3);
    }

    async function endVotingSession() {
        contract.methods.endVotingSession().send({ from: props.address });
        const status = await contract.methods.workflowStatus().call({ from: props.address });
        setStatus(4);
    }

    async function tallyVotes() {
        console.log("tally votes");
    }
 
    return (
        <div className="container">
            <h3>Workflow status : {status}</h3>
            <button onClick={startProposalsRegistering}>Start proposals registering</button>
            <button onClick={endProposalsRegistering}>End proposals registering</button>
            <button onClick={startVotingSession}>Start voting session</button>
            <button onClick={endVotingSession}>End voting session</button>
            <button onClick={tallyVotes}>Tally votes</button>
        </div>
    )
}

export default Owner;