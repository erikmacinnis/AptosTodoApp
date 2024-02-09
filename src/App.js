import React, {useEffect, useState} from 'react';
import './App.css';
import './init.js'
import DropDownList from './components/DropDown.js';
import NftsCollection from './components/NftsCollection';
import DisplayTasks from './components/DisplayTasks';
import CreateTask from './components/CreateTask.js';
import Leaderboard from './components/Leaderboard.js';
import CustomLoader from './components/Loader.js';
import { Button } from 'semantic-ui-react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Layout, Row, Col } from "antd";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import aptos from './aptos'
import myWorker from './workers/myWorker.worker.js'
import WorkerFactory from './workers/WorkerFactory.js'
import { AccountAddress } from "@aptos-labs/ts-sdk";

const App = () => {

  const { account, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(true);
  const [count, setCount] = useState(0);
  const [todo, setTodo] = useState(null)
  const [completed, setCompleted] = useState([]);
  const [resetTasks, setResetTasks] = useState(false);
  const [worker, setWorker] = useState(null);
  const [leaderboard, setNewLeaderboard] = useState([])
  // Nfts belonging to the collection
  const [nfts, setNfts] = useState([])

  const createWorker = () => {
    const workerInstance = new WorkerFactory(myWorker);
    setWorker(workerInstance);
    workerInstance.postMessage({
      url: window.env.BACKEND_ADDR,
    });

    workerInstance.onmessage = (res) => {
      setNewLeaderboard(JSON.parse(res.data))
    }
  }

  const closeWorker = () => {
    // This is causing an error. Seems like it is not defined
    // worker.terminate(); 
  }


  useEffect(() => {
    createWorker();
    window.addEventListener('unload', closeWorker);
    
    return () => {
      window.removeEventListener('unload', closeWorker);
      closeWorker();
    };
  }, []);

  useEffect(() => {
    initialFunction();
  }, [account, resetTasks])

  async function initialFunction() {
    // Wallet is connected
    if (account != null) {
        try {
          const tempTodo = await aptos.getAccountResource(
              {
                  accountAddress: account.address,
                  resourceType:`${window.env.MODULE_ADDR}::Todo::Todo`
              }
          );
          const count = tempTodo.count
          getCollectionAssets()
          setTodo(tempTodo)
          setCount(count);
          setLoading(false);
          setNewUser(false)
        } catch (err) {
          console.log(err)
          setNewUser(true)
          setLoading(false)
          setNfts([])
      }
    }
    setLoading(false)
  }

  async function getCollectionAssets() {
    const accountAddr = AccountAddress.fromStringStrict(account.address)
    const digitalAssets = await aptos.getAccountOwnedTokens({
      accountAddress: accountAddr,
    });
    const collectionId = window.env.COLLECTION_ID
    const collectionNfts = []
    for (const asset of digitalAssets) {
      if (asset.current_token_data.collection_id == collectionId) {
        asset.uriData = await getDataFromUri(asset.current_token_data.token_uri)
        collectionNfts.push(asset)
      }
    }
    setNfts(collectionNfts)
  }

  async function getDataFromUri(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Assuming the response data is a JSON object
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      throw error; // You can handle the error in the calling code as needed
    }
  }

  const createTodoList = async(event) => {
    event.preventDefault();
    // Setting loading screen
    setLoading(true);
    // Building transaction
    const transaction = {
        data : {
            function:`${window.env.MODULE_ADDR}::Todo::initialize`,
            functionArguments:[]
        }
    }
    try {
        const response = await signAndSubmitTransaction(transaction);
        await aptos.waitForTransaction({transactionHash:response.hash});
        initialFunction();
    } catch(err) {
      setNewUser(true)
    }
  }

  return (
      <div className="ui container">
        {loading ? (
          <CustomLoader />
          ) : (
            <>
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

          {newUser && 
          <Button 
            className="ui black button"
            onClick={(event) => createTodoList(event)}
            >Create a new Todo list</Button>
          }
          
          {!newUser && account && <DisplayTasks todo={todo} completed={completed} setCompleted={setCompleted} resetTasks={resetTasks} setResetTasks={setResetTasks}/>}
          {!newUser && account && <CreateTask resetTasks={resetTasks} setResetTasks={setResetTasks} setCount={setCount} count={count}/>}
          <br></br>
          {!newUser && <DropDownList completed={completed.reverse()} />}
          {!newUser && <Leaderboard leaderboard={leaderboard} />}
          {nfts.length != 0 && <NftsCollection nfts={nfts} />}
          </>
          )}
      </div>
  )
}

export default App;
