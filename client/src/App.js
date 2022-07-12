import React, { useEffect, useState } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./scripts/getWeb3";

import "./App.css";

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [owner, setOwner] = useState(null);

    useEffect(() => {
        async function setUpWeb3() {
            try {
                const web3Provider = await getWeb3();
                const accounts = await web3Provider.eth.getAccounts();
                const networkId = await web3Provider.eth.net.getId();
                const deployedNetwork = VotingContract.networks[networkId];
                const instance = new web3Provider.eth.Contract(
                    VotingContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                
                setWeb3(web3Provider);
                setAccounts(accounts);
                setContract(instance);
                setOwner(accounts[0]);

            } catch (error) {
                alert("Failed to load web3, accounts, or contract. Check console for details");
                console.error(error);
            }
        }
        
        setUpWeb3();
    },[]);

    if (!web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    function addNewVoter() {
        const voterToAdd = document.getElementById("new-voter-address").value;
        // console.log("new voter : ", voterToAdd);
        contract.methods.addVoter(voterToAdd).send({ from: owner });
    }

    async function getVoterFromAddress() {
        const voterAddress = document.getElementById("voter-address").value;
        console.log(voterAddress);
    }

    return (
        <div>
            <h1>Voting DApp</h1>
            <h3>Your address is {accounts}</h3>
            <p>Address test for new voter : 0x4E90a36B45879F5baE71B57Ad525e817aFA54890</p>
            <p>Address test for new voter : 0xb6A8490101a0521677B66866B8052eE9f9975C17</p>
            <p>Address test for new voter : 0x301E1528bAD61177eF8Ff89bD4ad6760581e5409</p>
            
            <p>Owner is {owner}</p>

            <div className="add-voter">
                <h3>Add new voter</h3>
                <div>
                    <input id="new-voter-address" type="text" placeholder="0x..."></input>
                    <button onClick={addNewVoter}>Validate</button>
                </div>

                <div>
                    <h3>Get voter</h3>
                    <input id="voter-address" type="text" placeholder="0x..."></input>
                    <button onClick={getVoterFromAddress}>Validate</button>
                </div>
            </div>
        </div>
    )
}

export default App;

/*
    Voters
        0x4E90a36B45879F5baE71B57Ad525e817aFA54890
        0xb6A8490101a0521677B66866B8052eE9f9975C17

    TODO
    2 écrans de connexion
        owner
        voter
    
*/