import Web3 from "web3";

const getWeb3 = () => new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
        // If the Client has a RPC provider
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // await window.ethereum.enable();
                resolve(web3);

                window.ethereum.on('disconnect', () =>{
                    alert("Vous n'êtes pas connecté");
                });
                window.ethereum.on('accountsChanged', () => {
                    window.location.reload();
                })
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                })
            } catch (error) {
                reject(error);
            }
        } 
        // If Web3 is injected by Metamask provider
        else if (window.web3) {
            const web3 = window.web3;
            console.log("Injected web3 detected");
            resolve(web3);
        } 
        // No provider found, fallback to localhost
        else {
            const provider = new Web3.provider.HttpProvider("http://127.0.0.1:8545");
            const web3 = Web3(provider);
            console.log("No web3 instance injected, using local web3");
            resolve(web3);
        }
    })
});


export default getWeb3;