export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT'
export const WEBSOCKET_SEND = 'WEBSOCKET_SEND'
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT'

export interface IWebsocket {
  [key: string]: WebSocket
}

const webSocketSet: IWebsocket = {}

function createActionType(actionPrefix: string, identity: string | number) {
  return identity ? `${actionPrefix}_${identity}` : actionPrefix
}

export const webSocketMiddleware = (store: any) => (next: any) => (action: any) => {
  const index: string = action.payload.identity || 'index'
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      webSocketSet[index] = new WebSocket(action.payload.url)
      webSocketSet[index].onopen = () => {
        store.dispatch({ type: `WEBSOCKET_OPEN__${action.payload.wsName}` })
        if (action.payload.onOpen) {
          action.payload.onOpen(webSocketSet[index])
        }
      }
      webSocketSet[index].onclose = () => {
        store.dispatch({ type: `WEBSOCKET_CLOSE_${action.payload.wsName}` })
      }

      webSocketSet[index].onmessage = (message: any) => {
        store.dispatch({ type: `WEBSOCKET_MESSAGE_${action.payload.wsName}`, payload: { message } })
      }
      break

    case WEBSOCKET_SEND:
      webSocketSet[index].send(action.payload.datas)
      break

    case WEBSOCKET_DISCONNECT:
      if (webSocketSet[index]) {
        webSocketSet[index].close()
      }
      break

    default:
      break
  }

  return next(action)
}
