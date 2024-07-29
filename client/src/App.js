import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        if (provider) {
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts.length > 0) {
              const signer = provider.getSigner();
              const address = await signer.getAddress();
              setAccount(address);
            } else {
              setAccount("");
              setContract(null);
            }
          });

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

          const contract = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );
          setContract(contract);
          setProvider(provider);
        } else {
          console.error("MetaMask is not installed");
        }
      } catch (error) {
        console.error("Error initializing provider:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeProvider();

    return () => {
      window.ethereum.removeAllListeners("chainChanged");
      window.ethereum.removeAllListeners("accountsChanged");
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading-screen">
          <span className="spinner"></span>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {!modalOpen && (
            <button className="share" onClick={() => setModalOpen(true)}>
              Share
            </button>
          )}
          {modalOpen && (
            <Modal setModalOpen={setModalOpen} contract={contract} />
          )}

          <div className="App">
            <h1 className="app-title">Monkey Share 🐒</h1>
            <p className="account-info">
              Account: {account ? account : "Not connected"}
            </p>
            <FileUpload account={account} provider={provider} contract={contract} />
            <Display contract={contract} account={account} />
          </div>
        </>
      )}
    </>
  );
}

export default App;




