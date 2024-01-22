import React, { useEffect, useState } from "react";
import { Grid } from 'semantic-ui-react';
import Loader from './InlineLoader';
import aptos from '../aptos'
import {useWallet} from "@aptos-labs/wallet-adapter-react";

const DisplayTasks = ({account, count, setCompleted, resetTasks}) => {
    
    const { signAndSubmitTransaction } = useWallet();
    const [tasks, setTasks] = useState([{id: 0}]);
    const [tasksFormatted, setTasksFormatted] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        setLoading(true);
        createTaskList();
    },[resetTasks])

    useEffect( () => {
        createFormattedTaskList();
        setLoading(false);
    }, [tasks])

    const checkTask = async(id) => {
            const transaction = {
                data : {
                    function:`${window.env.MODULE_ADDR}::Todo::check_task`,
                    functionArguments:[
                        id - 1,
                    ]
                }
            }
            try {
                const response = await signAndSubmitTransaction(transaction);
                await aptos.waitForTransaction({transactionHash:response.hash});
            } catch(err) {
                document.getElementById(id.toString()).checked = false;
                setLoading(false);
            }
        }

    const createTaskList = async () => {
        // Creates the list for the incompleted tasks
        const initialTasks = [];
        // Creates the list for the completed tasks
        // Used in CreateTask component
        const completedTasks = [];
        // This is just a dummy object
        const todo = await aptos.getAccountResource(
            {
                accountAddress:account?.address,
                resourceType:`${window.env.MODULE_ADDR}::Todo::Todo`
            }
        );

        console.log(todo)

        for (let task of todo.tasks){
            if (!task.completed){
                initialTasks.push(task); 
            } else {
                completedTasks.push(
                    {
                        key: task.id,
                        text: task.content,
                        value: task.content,
                        image: {avatar: true, src: '/images/checkmark.png'}
                    }
                );
            }        
        }
        setCompleted(completedTasks);
        setTasks(initialTasks);
    }

    // Creates the list of rows for the grid
    const createFormattedTaskList = () => {

        const length = tasks.length;
        // This is represents the tasks of the leftover incompleted row
        const mod = (length - 1) % 3;
        const taskRows = [];
        let i;
        for (i = 3; i < length; i += 3){
            let taskRow = (
                <Grid.Row key={i / 3}>
                    <Grid.Column textAlign='center'>
                        <div style={{width: "100%"}} className="ui left floated compact segment">
                            <div className="ui toggle checked checkbox">
                                <input
                                type="checkbox"
                                id={tasks[i-2].id.toString()}
                                name={tasks[i-2].id.toString()}
                                onClick={(event) => checkTask(event.target.name)}
                                ></input>
                                <label>{tasks[i-2].content}</label>
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column key={i-1} textAlign='center'>
                        <div style={{width: "100%"}} className="ui left floated compact segment">
                            <div  className="ui toggle checked checkbox">
                                <input
                                type="checkbox"
                                id={tasks[i-1].id.toString()}
                                name={tasks[i-1].id.toString()}
                                onClick={(event) => checkTask(event.target.name)}
                                ></input>
                                <label>{tasks[i-1].content}</label>
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column key={i} textAlign='center'>
                        <div style={{width: "100%"}} className="ui left floated compact segment">
                            <div className="ui toggle checked checkbox">
                                <input
                                type="checkbox"
                                id={tasks[i].id.toString()}
                                name={tasks[i].id.toString()}
                                onClick={(event) => checkTask(event.target.name)}
                                ></input>
                                <label>{tasks[i].content}</label>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
               )
            taskRows.push(taskRow);
       }
       if (mod !== 0){
           if (mod === 1){
                let taskRow = (
                   <Grid.Row key={i / 3}>
                       <Grid.Column key={length - 1}textAlign='center'>
                           <div style={{width: "100%"}} className="ui left floated compact segment">
                               <div className="ui toggle checked checkbox">
                                   <input
                                   type="checkbox"
                                   name={tasks[length - 1].id}
                                   onClick={() => {
                                    checkTask(tasks[length - 1].id)}}
                                   ></input>
                                   <label>{tasks[length - 1].content}</label>
                               </div>
                           </div>
                       </Grid.Column>
                   </Grid.Row>
               )
               taskRows.push(taskRow);
           }
           else {
                let taskRow = (
                   <Grid.Row key={i / 3}>
                       <Grid.Column key={length-2} textAlign='center'>
                           <div style={{width: "100%"}} className="ui left floated compact segment">
                               <div className="ui toggle checked checkbox">
                                   <input
                                   type="checkbox"
                                   name={tasks[length - 2].id}
                                   onClick={() => checkTask(tasks[length - 2].id)}
                                   ></input>
                                   <label>{tasks[length - 2].content}</label>
                               </div>
                           </div>
                       </Grid.Column>
                       <Grid.Column key={length-1} textAlign='center'>
                           <div style={{width: "100%"}} className="ui left floated compact segment">
                               <div className="ui toggle checked checkbox">
                                   <input
                                   type="checkbox"
                                   name={tasks[length - 1].id}
                                   onClick={() => checkTask(tasks[length - 1].id)}
                                   ></input>
                                   <label>{tasks[length - 1].content}</label>
                               </div>
                           </div>
                       </Grid.Column>
                   </Grid.Row>
               )
               taskRows.push(taskRow);
           }
       }
       setTasksFormatted(taskRows);
    }

    if (loading){
        return (
            <div className="loading">
                <Loader/>
            </div>
        );
    }
    else {
        console.log(tasks)
        return (
            <div className="ddl">
                <h1 
                style={{textAlign: "center", color: "#181818"}}>
                    {`You Have ${tasks.length - 1} Active Tasks`}
                </h1>
                <br/>
                <Grid style={{margin: '20px'}} columns={3} divided>
                    {tasksFormatted}
                </Grid>
            </div>
        );
    }
}


export default DisplayTasks;
