import React, { useEffect, useState } from "react";

function TalliedVote(props) {
    const [winningId, setWinningId] = useState(null);
    const [proposal, setProposal] = useState(null);
    const [contract, setContract] = useState(props.contract);

    useEffect(() => {
        setContract(props.contract);
        if (contract) {
            getWinningProposal();
        }
    },[props.contract])

    async function getOneProposal(id) {
        const proposal = await contract.methods.getOneProposal(id).call({ from: props.userAccount });
        setProposal(proposal);
    }

    async function getWinningProposal() {
        console.log(props.userAccount)
        const id =  await contract.methods.winningProposalID().call({ from: props.userAccount });
        setWinningId(id);
        getOneProposal(id);
    }

    return (
        <div>
            <p>Winning proposal is {proposal} with id {winningId}</p>
        </div>
    )
}

export default TalliedVote;