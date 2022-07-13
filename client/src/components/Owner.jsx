import React, { useState } from "react";
import WorkflowStatus from "./WorkflowStatus";

function Owner(props) {
    const [contract] = useState(props.contract);
    const [owner] = useState(props.owner);
    const [event, setEvent] = useState(null);
    const [myArray, setMyArray] = useState(["value1", "value2", "value3", "value4"]);

    async function addNewVoter() {
        const element = document.getElementById("new-voter-address");
        const voterToAdd = element.value;
        let transaction;

        try {
            // Récupérer l'évenement dans la transaction
            transaction = await contract.methods.addVoter(voterToAdd).send({ from: owner });
            setEvent(transaction.events.VoterRegistered.returnValues.voterAddress)
        } catch (error) {
            console.log(error)
        }
        element.value = "";
    }

    async function getProposalsEvent() {
        await contract.getPastEvents('ProposalRegistered', {
            fromBlock: 0,
            toBlock: "latest"
        }).then((error, events) => {
            console.log(events);
        });
    }

    // Test function
    function addValuesInArray() {
        let values = ["value1", "value2", "value3", "value4"]
        setMyArray(values);
        console.log(myArray);
    }

    return (
        <div>
            <WorkflowStatus contract={contract} address={owner}/>
            <h3>You're the owner - {owner}</h3>
            <p>Test addresses</p>
            <ul>
                <li>0x4E90a36B45879F5baE71B57Ad525e817aFA54890</li>
                <li>0xb6A8490101a0521677B66866B8052eE9f9975C17</li>
                <li>0xB0201641d9b936eB20155a38439Ae6AB07d85Fbd</li>
            </ul>

            <ul>
                {myArray.map((value, index) => <li key={index}>{value}</li>)}
            </ul>

            <div className="container">
                <h3>Add new voter</h3>
                <div>
                    <input id="new-voter-address" type="text" placeholder="0x..." />
                    <button onClick={addNewVoter}>Validate</button>
                </div>
                { event != null ? <p>Address {event} added</p> : null }
            </div>
                <button onClick={getProposalsEvent}>Proposal event console</button>
                <button onClick={addValuesInArray}>Add values</button>
        </div>
    )
}

export default Owner;