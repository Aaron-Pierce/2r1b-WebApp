import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './shared/SocketIOEvents';
import { nanoid } from 'nanoid';

const container = document.getElementById('root')!;
const root = createRoot(container);


let userId = localStorage.getItem("userId") || nanoid();
localStorage.setItem("userId", userId);

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
let socketInfoBundle = {
  socket: socket,
  userid: userId
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App socketInfo={socketInfoBundle} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
