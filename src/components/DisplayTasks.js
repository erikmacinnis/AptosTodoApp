import React, { useEffect, useState } from "react";
import { Grid } from 'semantic-ui-react';
import Loader from './InlineLoader';
import aptos from '../aptos'
import {useWallet} from "@aptos-labs/wallet-adapter-react";

const DisplayTasks = ({account, count, setCompleted, resetTasks}) => {
    
    const { signAndSubmitTransaction } = useWallet();
    const [tasks, setTasks] = useState([]);
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
        }
        createFormattedTaskList();
        setLoading(false);
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

    const taskColumn = (task) => {
        let taskClassName = "ui toggle checked checkbox";
        if (task.completed) {
            taskClassName = "ui read-only toggle checked checkbox"
        }
        return <Grid.Column textAlign='center'>
            <div style={{width: "100%"}} className="ui left floated compact segment">
                <div className={taskClassName}>
                    <input
                    type="checkbox"
                    id={task.id.toString()}
                    name={task.id.toString()}
                    onClick={(event) => {
                        if (event.target.checked) {
                            checkTask(event.target.name)
                        } else {
                            event.target.checked = true
                        }
                    }}
                    ></input>
                    <label>{task.content}</label>
                </div>
            </div>
        </Grid.Column>
    }

    // Creates the list of rows for the grid
    const createFormattedTaskList = () => {

        const length = tasks.length;
        if (length != 0) {
            // This is represents the tasks of the leftover incompleted row
            const mod = (length) % 3;
            const taskRows = [];
            let i;
            for (i = 3; i < length; i += 3){
                let taskRow = (
                    <Grid.Row key={i / 3}>
                        {taskColumn(tasks[i-2])}
                        {taskColumn(tasks[i-1])}
                        {taskColumn(tasks[i])}
                    </Grid.Row>
                    )       
                taskRows.push(taskRow);
            }
            if (mod !== 0){
                if (mod === 1){
                    let taskRow = (
                        <Grid.Row key={i / 3}>
                            {taskColumn(tasks[length - 1])}
                        </Grid.Row>
                    )
                    taskRows.push(taskRow);
                }
                else {
                    let taskRow = (
                        <Grid.Row key={i / 3}>
                            {taskColumn(tasks[length - 2])}
                            {taskColumn(tasks[length - 1])}
                        </Grid.Row>
                    )
                    taskRows.push(taskRow);
                }
            }
            setTasksFormatted(taskRows);
        }
    }

    if (loading){
        return (
            <div className="loading">
                <Loader/>
            </div>
        );
    }
    else {
        return (
            <div className="ddl">
                <h1 
                style={{textAlign: "center", color: "#181818"}}>
                    {`You Have ${tasks.length} Active Tasks`}
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
