import React, { Component } from "react";
import CrowdFunding from "./contracts/CrowdFunding.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function formatTimestamp(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  return `${date} ${month} ${year}`;
}

const parseState = (numState) =>
  ({ 0: "Ongoing", 1: "Failed", 2: "Succeeded", 3: "PaidOut" }[numState]);

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    contractName: "",
    contractTargetAmount: "0",
    contractTotalCollected: "0",
    contractState: 0,
    deadLine: 0,
    donationValue: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CrowdFunding.networks[networkId];
      const instance = new web3.eth.Contract(
        CrowdFunding.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract: instance }, this.loadInfo);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  loadInfo = async () => {
    const { contract } = this.state;
    const contractName = await contract.methods.name().call();
    const contractTargetAmount = await contract.methods.targetAmount().call();
    const contractTotalCollected = await contract.methods
      .totalCollected()
      .call();
    const contractState = await contract.methods.state().call();
    const deadLine = await contract.methods.fundingDeadline().call();

    this.setState({
      contractName,
      contractTargetAmount,
      contractTotalCollected,
      contractState,
      deadLine,
    });
  };

  handleClick = async () => {
    const { accounts, contract, donationValue } = this.state;
    contract.methods
      .contribute()
      .send({
        // value: web3.utils.toWei("1", "ether"),
        value: donationValue,
        from: accounts[0],
      })
      .then((result) => {
        console.log("success", result);
        this.loadInfo();
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  render() {
    const {
      contractName,
      contractTargetAmount,
      contractTotalCollected,
      contractState,
      web3,
      deadLine,
      donationValue,
    } = this.state;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>
          {contractName} (sate: {parseState(contractState)})
        </h1>
        <p>
          We are looking to get{" "}
          {web3?.utils?.fromWei(`${contractTargetAmount || 0}`)} ETH
        </p>
        <h2>
          We just have {web3?.utils?.fromWei(`${contractTotalCollected || 0}`)}{" "}
          ETH
        </h2>

        <p>Deadline: {formatTimestamp(deadLine)}</p>

        <button onClick={this.handleClick}>Donate</button>
        <input
          placeholder="Donation Value"
          value={donationValue}
          onChange={(e) => this.setState({ donationValue: e.target.value })}
          type="number"
        />
      </div>
    );
  }
}

export default App;
