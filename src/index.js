import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import "./index.css";

import Home from "./Component/Home";
import InGame from "./Component/InGame";

const socket = io("127.0.0.1:3000", {
  transports: ["websocket"],
});

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/ingame" element={<InGame socket={socket} />} />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Routes>
      </BrowserRouter>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
