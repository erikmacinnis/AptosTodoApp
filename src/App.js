import React, {useEffect, useState} from 'react';
import './App.css';
import './init.js'
import DropDownList from './components/DropDown.js';
import DisplayTasks from './components/DisplayTasks';
import CreateTask from './components/CreateTask.js';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Layout, Row, Col } from "antd";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

const App = () => {

  const { account } = useWallet();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [resetTasks, setResetTasks] = useState(false);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
      async function initialFunction() {
          if (account != null) {
            const todo = await aptos.getAccountResource(
                {
                    accountAddress: account.address,
                    resourceType:`${window.env.MODULE_ADDR}::Todo::Todo`
                }
            );
            const count = todo.count
            setCount(count);
            setLoading(false);
          }
      }
      initialFunction();
  })

    return (
        <div className="ui container">
            <Layout style={{ margin: '20px', backgroundColor: 'white'}}>
              <Row align="middle">
                <Col span={10} offset={2}>
                  <h1>Aptos Todo List</h1>
                </Col>
                <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
                    <WalletSelector />
                </Col>
              </Row>
            </Layout>
            
            {account && <DisplayTasks account={account} resetTasks={resetTasks} count={count} completed={completed} setCompleted={setCompleted}/>}
            {account && <CreateTask resetTasks={resetTasks} setResetTasks={setResetTasks} setCount={setCount} count={count}/>}
            <br></br>
            <DropDownList completed={completed} />
        </div>
    )
}

export default App;
