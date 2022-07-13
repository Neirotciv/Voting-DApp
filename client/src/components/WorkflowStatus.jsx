import React, { useState, useEffect } from "react";

function Owner(props) {
    const [contract, setContract] = useState(props.contract);
    const [status, setStatus] = useState(null);
    const [workflowStatusEvent, setworkflowStatusEvent] = useState(null);

    useEffect(() => {
        setContract(props.contract);
        getStatus();
    });

    async function getStatus() {
        if (contract) {
            const status = await contract.methods.workflowStatus().call({ from: props.address });
            setStatus(status);
        }
    }

    function updatePreviousNextStatusInFront(transaction) {
        const workflowStatus = [
            transaction.events.WorkflowStatusChange.returnValues.previousStatus,
            transaction.events.WorkflowStatusChange.returnValues.newStatus
        ];
        setworkflowStatusEvent(workflowStatus);
    }

    async function startProposalsRegistering() {
        try {
            const transaction = await contract.methods.startProposalsRegistering().send({ from: props.address });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.address });
            setStatus(status);
        } catch (error) {
            console.log(error);
        }
    }

    async function endProposalsRegistering() {
        try {
            const transaction = await contract.methods.endProposalsRegistering().send({ from: props.address });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.address });
            setStatus(status);
        } catch (error) {
            console.log(error);
        }
    }

    async function startVotingSession() {
        try {
            const transaction = await contract.methods.startVotingSession().send({ from: props.address });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.address });
            setStatus(status);
        } catch (error) {
            console.log(error);
        } 
    }

    async function endVotingSession() {
        try {
            const transaction = await contract.methods.endVotingSession().send({ from: props.address });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.address });
            setStatus(status);
        } catch (error) {
            console.log(error);
        } 
    }

    async function tallyVotes() {
        try {
            const transaction = await contract.methods.tallyVotes().send({ from: props.address });
            updatePreviousNextStatusInFront(transaction);
            const status = await contract.methods.workflowStatus().call({ from: props.address });
            setStatus(status);
        } catch (error) {
            console.log(error);
        } 
    }
 
    return (
        <div className="container">
            <h3>Workflow status : {status}</h3>
            <ul>
                <li>Previous status : {workflowStatusEvent == null ? "" : workflowStatusEvent[0]}</li>
                <li>New status : {workflowStatusEvent == null ? "" : workflowStatusEvent[1]}</li>
            </ul>
            <button onClick={startProposalsRegistering}>1 - Start proposals registering</button>
            <button onClick={endProposalsRegistering}>2 - End proposals registering</button>
            <button onClick={startVotingSession}>3 - Start voting session</button>
            <button onClick={endVotingSession}>4 - End voting session</button>
            <button onClick={tallyVotes}>5 - Tally votes</button>
        </div>
    )
}

export default Owner;