export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT';
export const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN';
export const WEBSOCKET_CLOSE = 'WEBSOCKET_CLOSE';
export const WEBSOCKET_MESSAGE = 'WEBSOCKET_MESSAGE';
export const WEBSOCKET_SEND = 'WEBSOCKET_SEND';
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT';

const webSocketSet: {
  [key: string]: WebSocket;
} = {};

const defaultIdentity = '__default__';

function createActionType(actionPrefix: string, identity: string | number): string {
  return identity === defaultIdentity ? actionPrefix : `${actionPrefix}_${identity}`;
}

export const webSocketMiddleware = (store: any) => (next: any) => (action: any) => {
  // Every dispatch trigger this middleware, may not have payload.
  const identity: string = (action.payload && action.payload.identity) || defaultIdentity;

  switch (action.type) {
    case WEBSOCKET_CONNECT:
      webSocketSet[identity] = new WebSocket(action.payload.url);
      webSocketSet[identity].onopen = () => {
        store.dispatch({
          type: createActionType(WEBSOCKET_OPEN, identity)
        });
        if (action.payload.onopen) {
          action.payload.onopen(webSocketSet[identity]);
        }
      };
      webSocketSet[identity].onclose = () => {
        store.dispatch({
          type: createActionType(WEBSOCKET_CLOSE, identity)
        });
        if (action.payload.onclose) {
          action.payload.onclose(webSocketSet[identity]);
        }
      };
      webSocketSet[identity].onmessage = (message: any) => {
        store.dispatch({
          type: createActionType(WEBSOCKET_MESSAGE, identity),
          payload: { message }
        });
      };
      break;

    case WEBSOCKET_SEND:
      webSocketSet[identity].send(action.payload.datas);
      break;

    case WEBSOCKET_DISCONNECT:
      if (webSocketSet[identity]) {
        webSocketSet[identity].close();
      }
      break;

    default:
      break;
  }

  return next(action);
};
