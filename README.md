# Redux websocket middleware

## Install

```bash
yarn add redux-middleware-ws
```

## Usage

```js
import { applyMiddleware, createStore } from "redux";
import {webSocketMiddleware} from "redux-middleware-ws";
import appReducer from "./reducer/index";

const store = createStore(appReducer, applyMiddleware(webSocketMiddleware);
```
