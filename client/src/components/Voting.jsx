import React, { useEffect, useState } from "react";

function Voting(props) {
    const [voterAddress, setVoterAddress] = useState(null);
    const [contract, setContract] = useState(props.contract);
    const [proposalId, setProposalId] = useState(null);

    useEffect(() => {
        setContract(props.contract);
    },[props.contract]);

    async function voteForProposal() {
        const element = document.getElementById("vote-proposal-id");
        const id = element.value;
        try {
            const transaction = await contract.methods.setVote(id).send({ from: props.userAccount });
            setVoterAddress(transaction.events.Voted.voter);
            setProposalId(transaction.events.Voted.proposalId);
        } catch (error) {
            console.log("vote for proposal", error);
        }
        element.value = "";
    }

    function Message() {
        if (voterAddress && proposalId) {
            return (
                <p>{voterAddress} has vote for proposal {proposalId}</p>
            )
        }
    }

    return (
        <div className="window">
            <h3>Voting</h3>
            <input id="vote-proposal-id" type="text" placeholder="Proposal id" />
            <button onClick={voteForProposal}>Validate</button>
            <Message />
        </div>
    )
}

export default Voting;