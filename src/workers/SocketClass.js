import { ACTION_STATUS, ACTIONS } from "./constants"

const DEFAULT_WSS_URL = 'wss://api-pub.bitfinex.com/ws/2'
class SocketClass {
    constructor(dataCallback, socketURL = null) {
        this.defaultURL = socketURL || DEFAULT_WSS_URL
        this.webSocket = null
        this.dataCallback = dataCallback
    }

    init () {
        this.webSocket = new WebSocket(this.defaultURL)
        this.webSocket.onclose = this.onClose
        this.webSocket.onerror = this.onError
        this.webSocket.onmessage = (e) => this.onMessage(e)
        this.webSocket.onopen = () => this.onOpen()
        return this
    }

    onClose () {
        console.log('Order Table WebSocket closed successfully')
    }

    onError (e) {
        console.log('Order Table WebSocket has faced the following error', e)
        
    }

    onMessage (e) {
        const data = this.transformer(e)
        if(data) {
            this.dataCallback(data, ACTIONS.LEADERBOARD_DATA_RECEIVED, ACTION_STATUS.SUCCESS)
        }
    }

    onOpen () {
        console.log('WebSocket opened successfully. Subscribing to book data')
        this.send({
            event: 'subscribe',
            channel: 'book',
            symbol: 'tBTCUSD'
        })
        this.dataCallback(null, ACTIONS.WEB_SOCKET_ONOPEN, ACTION_STATUS.SUCCESS)
    }

    send (data) {
        this.webSocket.send(JSON.stringify(data))
    }

    close () {
        this.send({
            event: 'unsubscribe',
            channel: 'book'
        })
        this.webSocket.close()
    }
    
    transformer(messageEvent) {
        const data = JSON.parse(messageEvent.data)
        if(!data.event) {
            return data
        }
        return null
    }
}
export default SocketClass