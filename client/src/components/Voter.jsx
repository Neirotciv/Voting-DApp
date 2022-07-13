import React, { useState } from "react";

function Voter(props) {
    const [account] = useState(props.account)
    const [contract] = useState(props.contract)
    const [contractAddress] = useState(null)

    function getVoterFromAddress() {
        const element = document.getElementById("voter-address");
        const voterAddress = element.value;
        contract.methods.getVoter(voterAddress).call({ from: account });
        console.log(voterAddress);
        element.value = "";
    }

    console.log(contract);

    return (
        <div>
            <h1>Voting DApp</h1>
            <h2>Your address is {account}</h2>
            <h2>Contract address is {contractAddress}</h2>

            <div className="container">
                <h3>Get voter</h3>
                <div>
                    <input id="voter-address" type="text" placeholder="0x..." />
                    <button onClick={getVoterFromAddress}>Validate</button>
                </div>
            </div>
        </div>
    )
}

export default Voter;