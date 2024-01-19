import React, {useEffect, useState} from 'react';
import './App.css';
import DropDownList from './components/DropDown.js';
import Loader from './components/Loader'
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Layout, Row, Col } from "antd";

const App = () => {

  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [resetTasks, setResetTasks] = useState(false);

  useEffect(() => {
      async function initialFunction() {
          console.log("initial")
          // const initialCount = await todo.methods.count().call();
          // setCount(initialCount);
          setLoading(false);
      }
      initialFunction();
  }, [])

  if (!loading){
      return (
          <div className="ui container">
              <Layout>
                <Row align="middle">
                  <Col span={10} offset={2}>
                    <h1>Aptos Todo List</h1>
                  </Col>
                  <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
                      <WalletSelector />
                  </Col>
                </Row>
              </Layout>
              {/* <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
                  <WalletSelector />
              </Col>
              <DisplayTasks resetTasks={resetTasks} count={count} completed={completed} setCompleted={setCompleted}/>
              <CreateTask resetTasks={resetTasks} setResetTasks={setResetTasks} setCount={setCount} count={count}/>
              <br></br> */}
              <DropDownList completed={completed} />
          </div>
      )
  }

  return(
      <Loader/>
  )
}

export default App;
