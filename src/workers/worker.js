import SocketClass from "./SocketClass.js"
import { ACTION_STATUS, ACTIONS } from "./constants"

self.onmessage = (e) => {
    console.log('Message from main thread', e)
    const data = e.data
    if(validateEventData(data)) {
        actionSwitcher(data.action, data.payload)
    } else {
        console.log('Invalid message data passed from main thread so taking no action')
    }
}

const validateEventData = (data) => {
  //Validate all the request from main thread if you want to follow strict communication protocols
  //between main thread and the worker thread
    return true
}

let webSocket = null

const orderTableDataCallback = (data, action, status) => {
    postMessage({
        action,
        data,
        status
    })
}

export const closeWebSocket = () => {
    webSocket && webSocket.close()
}

const actionSwitcher = (action = '', payload = {}) => {
    let result = {}
    try {
        switch (action) {
            case ACTIONS.LEADERBOARD_INIT:
                webSocket = new SocketClass(orderTableDataCallback)
                webSocket.init()
                result = {
                    action: `${ACTIONS.LEADERBOARD_INIT}`,
                    data: 'Order Table WebSocket initialized',
                    status: ACTION_STATUS.SUCCESS
                }
                break;
        }
    }
    catch (e) {
        result.action = action
        result.error = e
        result.status = ACTION_STATUS.FAILURE
    }
    postMessage(result)
}