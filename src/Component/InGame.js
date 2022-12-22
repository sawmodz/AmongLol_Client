import React from "react";

export default class InGame extends React.Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem("match") === null) {
      window.location.replace("http://localhost:3001");
      return;
    }
    const match = JSON.parse(localStorage.getItem("match"));
    props.socket.emit("joinParty", {
      nickname: match.nickname,
      code: match.id,
    });

    props.socket.on("playerJoin", (message) => {
      console.log(message);
    });
  }
  render() {
    return <div>InGame</div>;
  }
}
