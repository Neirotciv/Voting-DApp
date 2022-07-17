import React, { useEffect, useState } from "react";

function Proposals(props) {
    const [listId, setListId] = useState([]);
    const [contract, setContract] = useState(props.contract);

    useEffect(() => {
        async function updateProposalList() {
            const options = {
                fromBlock: 0,
                toBlock: "latest"
            }
            const proposalsId = await contract.getPastEvents("ProposalRegistered", options);
            setListId(proposalsId);
        }

        updateProposalList();
    },[]);

    contract.events.ProposalRegistered({ fromBlock: "latest" })
        .on('data', event => {
                listId.push(event);
                setListId(listId);
        });

    return (
        <div className="window">
            <h3>Proposals list</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Id</td>
                        <td>Description</td>
                    </tr>
                    {listId.map(element => (
                        <tr key={element.returnValues.proposalId}>
                            <td>{element.returnValues.proposalId}</td>
                            <td>description</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Proposals;