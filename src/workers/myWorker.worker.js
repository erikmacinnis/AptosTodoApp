// src/workers/myWorker.worker.js
export default () => {
    let websocket = null
    let url = null

    self.addEventListener('message', (event) => { /* eslint-disable-line no-restricted-globals */
        url = event.data.url;
        startUpWebsocket(url);
    });

    function startUpWebsocket(url) {
        websocket = new WebSocket(url);

        websocket.addEventListener('message', (event) => {
            self.postMessage(event.data) /* eslint-disable-line no-restricted-globals */
        });

        websocket.onclose = function() {
            setTimeout(() => {
                startUpWebsocket(url);
            }, 5000);
        }
    }
};