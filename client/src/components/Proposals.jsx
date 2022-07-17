import React, { useEffect, useState } from "react";
import Winning from "./Winning";

function Proposals(props) {
    const [proposals, setProposals] = useState([]);
    const [contract, setContract] = useState(props.contract);

    useEffect(() => {
        updateProposalList();
    },[]);

    async function updateProposalList() {
        const options = {
            fromBlock: 0,
            toBlock: "latest"
        }
        const proposalsEvent = await contract.getPastEvents("ProposalRegistered", options);
        const proposal = proposalsEvent.map(event => 
            {   
                return { id: event.returnValues.proposalId, description: event.returnValues.proposal, vote: 0 };
            }  
        );
        setProposals(proposal);
    }

    contract.events.ProposalRegistered({ fromBlock: "latest" })
        .on('data', proposalsEvent => {
            updateProposalList()
        });

    async function updateVote(id) {
        const vote = await contract.methods.getOneProposal(id).call({ from: props.userAccount });
        console.log(vote);
    }

    return (
        <div className="window">
            <Winning userAccount={props.userAccount}  contract={props.contract} />
            <h3>Proposals list</h3>
            <table>
                <tbody>
                    <tr>
                        <td><strong>Id</strong></td>
                        <td><strong>Description</strong></td>
                        <td><strong>Vote</strong></td>
                    </tr>
                    {proposals.map(proposal => (
                        <tr key={proposal.id}>
                            <td>{proposal.id}</td>
                            <td>{proposal.description}</td>
                            <td>{proposal.vote}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Proposals;