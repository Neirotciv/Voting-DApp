import React, { useEffect, useState } from "react";

function Winning(props) {
    const [status, setStatus] = useState("0");
    const [idWinningProposal, setIdWinningProposal] = useState(null);
    const [contract, setContract] = useState(props.contract);

    useEffect(() => {
        async function updateStatus() {
            if (contract) {
                const statusId = await contract.methods.workflowStatus().call({ from: props.userAccount });
                setStatus(statusId);
            }
        }
        
        if (status === "5") {
            getWinningProposal();
        }

        updateStatus();
    },[status]);

    if (contract) {
        contract.events.WorkflowStatusChange({ fromBlock: "latest" }) 
        .on('data', event => {
            let newStatus = event.returnValues.newStatus;
            setStatus(newStatus);
        })
    }

    async function getWinningProposal() {
        const id = await contract.methods.winningProposalID().call({ from: props.userAccount });
        setIdWinningProposal(id);
    }

    if (status === "5") {
        return (
            <div className="good">
                <h3>Winning proposal is {idWinningProposal}</h3>
            </div>
        );
    }
    
}

export default Winning;