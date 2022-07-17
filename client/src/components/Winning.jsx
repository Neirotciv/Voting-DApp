import React, { useEffect, useState } from "react";

function Winning(props) {
    const [workflowStatus, setworkflowStatus] = useState(props.workflowStatus);
    const [idWinningProposal, setIdWinningProposal] = useState(null);
    const [contract, setContract] = useState(props.contract);

    useEffect(() => {
        console.log(props.workflowStatus)
        if (props.workflowStatus == 5) {
            console.log("Tallied vote");
            getWinningProposal();
        }
    },[]);

    async function getWinningProposal() {
        const id = await contract.methods.winningProposalID().call({ from: props.userAccount });
        setIdWinningProposal(id);
    }


    return (
        <div className="window">
            <h3>Winning proposal is {idWinningProposal}</h3>
        </div>
    )
}

export default Winning;