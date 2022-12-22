import React from "react";
import "./css/Home.css";

let language = "";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    if (localStorage.getItem("match") !== null) {
      window.location.replace("http://localhost:3001/ingame");
    }
    props.socket.on("createParty", (message) => {
      localStorage.setItem("match", JSON.stringify(message.match));
      window.location.replace("http://localhost:3001/ingame");
    });

    props.socket.on("joinParty", (message) => {
      switch (message.error) {
        case 2:
          this.setState({ error2: language.code_full });
          break;
        case 1:
          this.setState({ error2: language.code_error });
          return;
        default:
          break;
      }
      localStorage.setItem("match", JSON.stringify(message.match));
      window.location.replace("http://localhost:3001/ingame");
    });

    const lg = window.navigator.language;
    if (lg !== "fr-FR") {
      language = require("../Language/base.json");
      return;
    }
    language = require("../Language/" + lg + ".json");
  }

  state = {
    code_join: "",
    nickname_join: "",
    nickname_create: "",
    error2: "",
    error: "",
  };
  render() {
    return (
      <div className="main">
        <h1 className="title">{language.Title}</h1>
        <div className="joinBox">
          <div className="joinpartybox">
            <h2 className="joinpartytitle">{language.JoinParty}</h2>
            <div>
              <h3>{language.Nickname}</h3>
              <input
                type="text"
                onChange={(e) => {
                  this.setState({ nickname_join: e.target.value });
                }}
              />
            </div>

            <div>
              <h3>{language.Code}</h3>
              <input
                type="text"
                onChange={(e) => {
                  this.setState({ code_join: e.target.value });
                }}
              />
            </div>

            <h5 className="error">{this.state.error2}</h5>

            <div
              className="joinButton"
              onClick={() => {
                if (this.state.nickname_join.length < 3) {
                  this.setState({
                    error2: language.nickname_error,
                  });
                  return;
                }
                if (this.state.code_join.length !== 9) {
                  this.setState({
                    error2: language.code_error,
                  });
                  return;
                }

                this.props.socket.emit("joinParty", {
                  nickname: this.state.nickname_join,
                  code: this.state.code_join,
                });
              }}
            >
              <h4 className="joinButtonText">{language.Join}</h4>
            </div>
          </div>

          <div className="joinpartybox">
            <h2 className="joinpartytitle">{language.CreateParty}</h2>
            <div>
              <h3>{language.Nickname}</h3>
              <input
                type="text"
                onChange={(e) => {
                  this.setState({ nickname_create: e.target.value });
                }}
              />
            </div>
            <h5 className="error">{this.state.error}</h5>
            <div
              className="joinButton"
              onClick={() => {
                if (this.state.nickname_create.length < 3) {
                  this.setState({
                    error: language.nickname_error,
                  });
                  return;
                }
                this.props.socket.emit("createParty", {
                  nickname: this.state.nickname_create,
                });
              }}
            >
              <h4 className="joinButtonText">{language.CreateParty}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
