import React, {useState} from 'react';
import { Button, Form } from 'semantic-ui-react';
import Loader from './InlineLoader';
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import aptos from '../aptos'

const CreateTask = ({setCount, count, setResetTasks, resetTasks}) => {

    const { signAndSubmitTransaction } = useWallet();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const createTask = async(event) => {
        event.preventDefault();
        // Setting loading screen
        setLoading(true);
        // Adding item to count
        setCount(parseInt(count) + 1);
        // Building transaction
        const transaction = {
            data : {
                function:`${window.env.MODULE_ADDR}::Todo::create_task`,
                functionArguments:[
                    content,
                ]
            }
        }
        try {
            const response = await signAndSubmitTransaction(transaction);
            await aptos.waitForTransaction({transactionHash:response.hash});
        } catch(err) {
            setLoading(false);
        }
        setLoading(false);
        setResetTasks(!resetTasks);
    }

    if (loading) {
        return <Loader/>;
    }

    return (
        <Form className="createTask" style={{margin: '30px'}}>
            <Form.Field>
                <label style={{fontSize: "15px", Color: "#181818"}}>Create a Task</label>
                <input 
                value = {content}
                placeholder='I will brush my teeth' 
                onChange={event => setContent(event.target.value)}/>
            </Form.Field>
            <Button 
            className="ui black button"
            type='submit'
            onClick={(event) => createTask(event)}
            >Create</Button>
        </Form>
    )
}

export default CreateTask;