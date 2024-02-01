// src/workers/myWorker.worker.js
export default () => {
    self.addEventListener('message', (event) => { /* eslint-disable-line no-restricted-globals */
        const data = event.data.data;
        console.log(data)
        performIntensiveTask(data);
        self.postMessage('response'); /* eslint-disable-line no-restricted-globals */
    });

    let websocket = null

    function performIntensiveTask(url) {
        console.log(url)
        websocket = new WebSocket(url);

        websocket.addEventListener('message', (event) => {
            console.log(event)
            self.postMessage('event') /* eslint-disable-line no-restricted-globals */
        });
    }
};