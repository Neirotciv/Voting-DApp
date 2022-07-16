import React, { useEffect, useState } from "react";

function AddVoter(props) {
    const [event, setEvent] = useState(null);
    const [contract, setContract] = useState(props.contract);

    useEffect(() => {
        setContract(props.contract);
    },[props.contract]);

    async function addNewVoter() {
        const element = document.getElementById("new-voter-address");
        const voterToAdd = element.value;
        let transaction;

        try {
            // Récupérer l'évenement dans la transaction
            transaction = await contract.methods.addVoter(voterToAdd).send({ from: props.userAccount });
            const event = transaction.events.VoterRegistered.returnValues.voterAddress;
            setEvent(event);
        } catch (error) {
            console.log(error)
        }

        element.value = "";
    }

    return (
        <div className="window">
            <h3>Add new voter</h3>
            <input id="new-voter-address" type="text" placeholder="address 0x..." />
            <button onClick={addNewVoter}>Validate</button>
            {(event === null ? "" : <p>{event} just recorded</p>)}
        </div>
    )
}

export default AddVoter;