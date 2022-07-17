import React, { useEffect, useState } from "react";

function Voters(props) {
    const [votersAddress, setVotersAddress] = useState([]);
    const [contract, setContract] = useState(props.contract);

    useEffect(() => {
        async function updateVotersList() {
            const options = {
                fromBlock: 0,
                toBlock: "latest"
            }
            const addressesEvent = await contract.getPastEvents("VoterRegistered", options);
            const addresses = addressesEvent.map(event => event.returnValues.voterAddress);
            setVotersAddress(addresses);
        }

        updateVotersList();
    },[]);

    useEffect(() => {
        votersAddress.push(props.newVoter);
    },[props.newVoter])

    return (
        <div>
            <h3>Voters list</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Address</td>
                    </tr>
                    {votersAddress.map(address => (
                        <tr key={address}>
                            <td>{address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Voters;