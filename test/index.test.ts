import { webSocketMiddleware } from '../src/';
// import { WebSocket, Server, SocketIO } from 'mock-socket';
import { Server } from 'mock-socket';
import { createStore, applyMiddleware } from 'redux';

function appStore(state = 0, action) {
  switch (action.type) {
    case 'WEBSOCKET_CONNECT':
    case 'WEBSOCKET_MESSAGE':
      console.log(state);
      return state + 1;
      break;
  }
}

let store = createStore(appStore, applyMiddleware(webSocketMiddleware));

describe('Redux middleware websocket', () => {
  it('basic test', done => {
    const mockServer = new Server('ws://localhost:8080');
    mockServer.on('connection', server => {
      mockServer.send('test message 1');
    });

    // Now when Chat tries to do new WebSocket() it
    // will create a MockWebSocket object \
    // const chatApp = new Chat();

    // store.subscribe(() =>
    //   console.log(store.getState())
    // );

    store.dispatch({
      type: 'WEBSOCKET_CONNECT',
      payload: {
        url: 'ws://localhost:8080'
      }
    });

    setTimeout(() => {
      expect(store.getState()).toBe(1);
      console.log(store.getState());
      mockServer.stop(done);
    }, 100);
  });
});
