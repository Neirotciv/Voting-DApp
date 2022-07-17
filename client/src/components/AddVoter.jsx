import React, { useEffect, useState } from "react";
import Voters from "./Voters";

function AddVoter(props) {
    const [event, setEvent] = useState(null);
    const [contract, setContract] = useState(props.contract);
    const [newVoter, setNewVoter] = useState(null)

    useEffect(() => {
        setContract(props.contract);
    },[props.contract]);

    async function addNewVoter() {
        const element = document.getElementById("new-voter-address");
        const voterToAdd = element.value;
        setNewVoter(voterToAdd);
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
            <h3>Add new voter <em>(only in registering voters session)</em></h3>
            <input id="new-voter-address" type="text" placeholder="address 0x..." />
            <button onClick={addNewVoter}>Validate</button>
            {(event === null ? "" : <p className="good">{event} just recorded</p>)}
            <Voters contract={props.contract} newVoter={newVoter} />
        </div>
    )
}

export default AddVoter;