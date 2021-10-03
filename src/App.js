import React, { Component } from "react";
import moment from "moment";
import CrowdFunding from "./contracts/CrowdFunding.json";
import getWeb3 from "./getWeb3";
import { ToastContainer, toast } from "react-toastify";
import {
  Container,
  Header,
  Divider,
  Button,
  Input,
  Grid,
  Progress,
  Message,
  Label,
} from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

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
    donationValue: "",
    selectedAccount: "",
    loading: false,
  };

  componentDidMount = () => {};

  handleConnect = async () => {
    try {
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

    this.setState({ loading: true });
    const id = toast.loading("Transction in progres...");

    contract.methods
      .contribute()
      .send({
        value: donationValue,
        from: accounts[0],
      })
      .then((result) => {
        this.setState({ donationValue: "" });
        this.loadInfo();
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        this.setState({ loading: false });
        toast.update(id, {
          render: "Transaction completed!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
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
      accounts,
      loading,
    } = this.state;
    const progress = Math.round(
      (contractTotalCollected * 100) / contractTargetAmount
    );
    return (
      <Container style={{ margin: 16 }}>
        <Header as="h1">Crowd Funding ETH smart contract</Header>
        <Divider />
        {!accounts ? (
          <>
            <Button color="blue" onClick={this.handleConnect}>
              Connect to your wallet
            </Button>
          </>
        ) : (
          <Grid container>
            <Grid.Row>
              <p>Contract Name: {contractName}</p>
            </Grid.Row>
            <Grid.Row>
              <p>Status: {parseState(contractState)}</p>
            </Grid.Row>
            <Grid.Row>
              <p>
                Deadline: {moment.unix(deadLine).format("LL")} - ({" "}
                {moment.unix(deadLine).fromNow()} )
              </p>
            </Grid.Row>
            <Grid.Row>
              <p>
                Looking to get:{" "}
                {web3?.utils?.fromWei(`${contractTargetAmount || 0}`)} ETH
              </p>
            </Grid.Row>
            <Grid.Row>
              <p>
                Total Collected{" "}
                {web3?.utils?.fromWei(`${contractTotalCollected || 0}`)} ETH
              </p>
            </Grid.Row>
            <Grid.Row>
              <Progress
                style={{ width: "100%" }}
                progress
                percent={progress}
                active
              />
            </Grid.Row>
            <Divider />
            <Grid.Row>
              <Message>
                <Message.Header>Want to donate?</Message.Header>
                <p>
                  Set your donation amount below and press the "Donate" button
                </p>
              </Message>
            </Grid.Row>

            <Grid.Row>
              <Label>
                <p>From Account</p>
              </Label>
              <Input value={accounts[0].slice(-6)} disabled />
            </Grid.Row>
            <Grid.Row>
              <Input
                placeholder="Donation Amount"
                value={donationValue}
                onChange={(e) => {
                  this.setState({ donationValue: e.target.value });
                }}
                type="number"
                label={{ basic: true, content: "wei" }}
                labelPosition="right"
                iconPosition="left"
                loading={loading}
                disabled={loading}
              />
            </Grid.Row>
            <Grid.Row>
              <Button
                loading={loading}
                onClick={this.handleClick}
                color="blue"
                disabled={donationValue < 1 || loading}
              >
                Donate
              </Button>
            </Grid.Row>
          </Grid>
        )}
        <ToastContainer autoClose={5000} />
      </Container>
    );
  }
}

export default App;
