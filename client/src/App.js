import React, { useEffect, useState } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./scripts/getWeb3";

import "./App.css";

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);

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

    return (
        <div>
            <h1>Voting DApp</h1>
            <h3>Your address is {accounts}</h3>
            {/* <h3>Contract address is {contract}</h3> */}
        </div>
    )
}

export default App;


/*
    TODO
    2 écrans de connexion
        owner
        voter
    
*/