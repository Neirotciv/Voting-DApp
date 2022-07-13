import React, { useEffect, useState } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./scripts/getWeb3";
// import Voter from "./components/Voter";
// import Owner from "./components/Owner";

import "./App.css";

function App() {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);
    const [owner, setOwner] = useState(null);
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        async function setUpWeb3() {
            try {
                const web3Provider = await getWeb3();
                const accounts = await web3Provider.eth.getAccounts();
                const networkId = await web3Provider.eth.net.getId();
                const deployedNetwork = VotingContract.networks[networkId];
                const instance = await new web3Provider.eth.Contract(
                    VotingContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                const contractOwner = await instance.methods.owner().call();

                setWeb3(web3Provider);
                setContract(instance);
                setAccounts(accounts);
                setOwner(contractOwner);
                
                if (accounts[0] === contractOwner) { setIsOwner(true) }
                
            } catch (error) {
                alert("Failed to load web3, accounts, or contract. Check console for details");
                console.error(error);
            }
        }
        
        setUpWeb3();
    },[]);

    // ----------- WORKFLOW STATUS -----------

    // ----------- FUNCTIONS -----------

    // ----------- COMPONENTS -----------
    
    function Owner() {
        return (
            <div>
                <h1>Owner</h1>
            </div>
        )
    }

    function Voter() {
        return (
            <div>
                <h1>Voter</h1>
            </div>
        )
    }

    function UserDashboard(props) {
        if (props.isOwner) {
            return <Owner />;
        }
        return <Voter />;
    }

    if (!web3 && !contract) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
        <UserDashboard isOwner={isOwner}/>
    )
}

export default App;