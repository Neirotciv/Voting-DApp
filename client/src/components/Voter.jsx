import React, { useState, useEffect } from "react";

function Voter(props) {
    const [account] = useState(props.account);
    const [contract, setContract] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);

    useEffect(() => {
        setContract(props.myContract);
        if (contract) {
            setContractAddress(contract.options.address);
        }
    });

    async function getVoterFromAddress() {
        const element = document.getElementById("voter-address");
        const voterAddress = element.value;
        const transaction = await contract.methods.getVoter(voterAddress).call({ from: account });
        element.value = "";
    }

    async function addProposal() {
        const element = document.getElementById("proposal-description");
        const description = element.value;
        await contract.methods.addProposal(description).send({ from: account[0] });
    }

    return (
        <div>
            <h1>Voting DApp, contract {contractAddress}</h1>
            <h2>Your address is {account}</h2>
            <div className="container">

            </div>

            <div className="container">
                <h3>Get voter</h3>
                <div>
                    <input id="voter-address" type="text" placeholder="0x..." />
                    <button onClick={getVoterFromAddress}>Validate</button>
                </div>
            </div>

            <div className="container">
                <h3>You're proposal</h3>
                <input id="proposal-description" type="text" placeholder="Description..." />
                <button onClick={addProposal}>Validate</button>
            </div>
        </div>
    )
}

export default Voter;