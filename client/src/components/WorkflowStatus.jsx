import React, { useEffect, useState } from "react";

function WorkflowStatus(props) {
    const [stringStatus, setStringStatus] = useState("Registering voters");
    const [contract, setContract] = useState(null);
    const [status, setStatus] = useState(0);

    useEffect(() => {
        setContract(props.contract);
        updateStatus();
    },[props.contract]);

    // Je veux récupérer le workflowstatus actuel
    if (contract) {
        contract.events.WorkflowStatusChange({ fromBlock: "latest" }) 
        .on('data', event => {
            console.log(event)
            let newStatus = event.returnValues.newStatus;
            setStatus(newStatus);
            stringStatusFromId(newStatus)
        })
    }

    async function updateStatus() {
        if (contract) {
            const statusId = await contract.methods.workflowStatus().call({ from: props.userAccount });
            setStatus(statusId);
            stringStatusFromId(statusId)
        }
    }

    function stringStatusFromId(id) {
        switch (id) {
            case "0":
                setStringStatus("Registering voters");
                break;
            case "1":
                setStringStatus("Proposals registration started");
                break;
            case "2":
                setStringStatus("Proposals registration ended");
                break;
            case "3":
                setStringStatus("Voting session started");
                break;
            case "4":
                setStringStatus("Voting session ended");
                break;
            case "5":
                setStringStatus("Votes tallied");
                break;
            default:
                setStringStatus("Status error");
        }
    }

    window.onload = updateStatus();
    
    return (
        <div>
            <hr/>
            <h3>Workflowstatus {status} : {stringStatus}</h3>
        </div>
    )
}

export default WorkflowStatus;