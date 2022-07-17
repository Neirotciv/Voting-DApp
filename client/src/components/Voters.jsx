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
            const addresses = await contract.getPastEvents("VoterRegistered", options);
            setVotersAddress(addresses);
        }

        updateVotersList();
    },[]);

    contract.events.VoterRegistered({ fromBlock: "latest" })
        .on('data', event => {
            votersAddress.push(event);
            setVotersAddress(votersAddress);
        });

    return (
        <div>
            <h3>Voters list</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Address</td>
                    </tr>
                    {votersAddress.map(element => (
                        <tr key={element.returnValues.voterAddress}>
                            <td>{element.returnValues.voterAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Voters;