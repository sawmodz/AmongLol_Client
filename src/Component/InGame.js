import React from "react";
import "./css/inGame.css";
import trash from "../icons/trash.png";
import crown from "../icons/crown.png";

let language = "";

export default class InGame extends React.Component {
  state = {
    users: [],
    isOwner: false,
    status: "",
    roles: 0,
    rolesResult: {},
    isValid: false,
    rolesNumber: 0,
    result: {},
  };
  constructor(props) {
    super(props);
    const lg = window.navigator.language;
    if (lg !== "fr-FR") {
      language = require("../Language/base.json");
      return;
    }
    language = require("../Language/" + lg + ".json");

    if (localStorage.getItem("match") === null) {
      window.location.replace("http://localhost:3001");
      return;
    }

    const match = JSON.parse(localStorage.getItem("match"));
    props.socket.emit("joinParty", {
      nickname: match.nickname,
      code: match.id,
    });

    props.socket.on("joinParty", (message) => {
      if (message.error === 1 || message.error === 2) {
        localStorage.clear();
        window.location.replace("http://localhost:3001");
        return;
      }
      this.setState({
        users: message.match.users,
        isOwner: message.match.owner === match.nickname,
        status: message.match.status,
      });
    });

    props.socket.on("end", (message) => {
      let myValue = message.myResult;
      let resultFinal = {};
      let userRoles = {};
      myValue.forEach((result) => {
        userRoles[result.user] = result.roles;
      });
      myValue.forEach((result) => {
        let myresult = {};
        for (let key in result.result) {
          switch (result.result[key]) {
            case "Imposteur":
              myresult[key] = userRoles[key] === 1;
              break;
            case "Le pacifiste":
              myresult[key] = userRoles[key] === 2;
              break;
            case "Clavier cassé":
              myresult[key] = userRoles[key] === 3;
              break;
            case "Epée de plume":
              myresult[key] = userRoles[key] === 4;
              break;

            default:
              myresult[key] = userRoles[key] === 5;
              break;
          }
        }
        resultFinal[result.user] = myresult;
      });
      this.setState({ result: resultFinal, status: 3 });
      console.log(resultFinal);
    });

    props.socket.on("chooseRoles", (message) => {
      this.setState({ status: message.status });
    });

    props.socket.on("playerJoin", (message) => {
      this.setState({
        users: message.match.users,
        isOwner: message.match.owner === match.nickname,
        status: message.match.status,
      });
    });

    props.socket.on("valid", (message) => {
      this.setState({ isValid: true });
    });

    props.socket.on("kickPlayer", (message) => {
      if (message.user === match.nickname) {
        localStorage.clear();
        window.location.replace("http://localhost:3001");
        props.socket.emit("leaveParty", { code: match.code });
        return;
      }
      this.setState({
        users: this.state.users.filter((user) => {
          return user !== message.user;
        }),
      });
    });

    props.socket.on("roles", (message) => {
      let role = "";
      switch (message.roles) {
        case 2:
          role = language.role1;
          break;
        case 3:
          role = language.role2;
          break;
        case 4:
          role = language.role3;
          break;
        case 5:
          role = language.role4;
          break;
        default:
          role = language.role5;
          break;
      }
      this.setState({ roles: role, status: 1, rolesNumber: message.roles });
    });
  }
  render() {
    const storage = JSON.parse(localStorage.getItem("match"));
    return (
      <div className="Main">
        <div className="users">
          <h2 className="joueur">
            {language.players + " ( " + storage.id + " )"}
          </h2>
          {this.state.users.map((user, key) => {
            return (
              <div className="user" key={key}>
                <h3 className="userName">{user}</h3>
                {user === storage.owner && (
                  <img className="userCrown" src={crown} alt="Trash" />
                )}
                {this.state.isOwner && user !== storage.owner && (
                  <img
                    className="userTrash"
                    src={trash}
                    alt="Trash"
                    onClick={() => {
                      this.props.socket.emit("kickPlayer", {
                        user,
                        code: storage.id,
                      });
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="center">
          <h1 className="status">
            {this.state.status === 0 && "EN ATTENTE"}
            {this.state.status === 1 && "Ton roles est "}
          </h1>
          <h2 className="roles">
            {this.state.status === 1 && this.state.roles}
          </h2>
          {(this.state.isOwner && this.state.status) === 1 && (
            <div
              className="startButton"
              onClick={() => {
                this.props.socket.emit("chooseRoles", { code: storage.id });
              }}
            >
              <h2 className="buttonText">{language.finishRolesPhases}</h2>
            </div>
          )}
          {this.state.status === 2 && (
            <div className="selector">
              {this.state.users.map((user, key) => {
                if (user === storage.nickname) return;
                return (
                  <div
                    key={key}
                    className="selectorUser"
                    onChange={(e) => {
                      this.setState({
                        rolesResult: {
                          ...this.state.rolesResult,
                          [user]: e.target.value,
                        },
                      });
                    }}
                  >
                    <h3 className="selectorTitle">{user}</h3>
                    <select
                      className="selectRank"
                      defaultValue={language.nothing}
                    >
                      <option value={language.nothing} selected>
                        {language.nothing}
                      </option>
                      <option value={language.role1_title}>
                        {language.role1_title}
                      </option>
                      <option value={language.role2_title}>
                        {language.role2_title}
                      </option>
                      <option value={language.role3_title}>
                        {language.role3_title}
                      </option>
                      <option value={language.role4_title}>
                        {language.role4_title}
                      </option>
                      <option value={language.role5_title}>
                        {language.role5_title}
                      </option>
                    </select>
                  </div>
                );
              })}
            </div>
          )}
          {this.state.status === 2 && (
            <div
              className={
                !this.state.isValid ? "startButton" : "startButtonDisable"
              }
              onClick={() => {
                this.props.socket.emit("valid", {
                  reply: this.state.rolesResult,
                  player: storage.nickname,
                  code: storage.id,
                  roles: this.state.rolesNumber,
                });
              }}
            >
              <h2 className="buttonText">{language.valid}</h2>
            </div>
          )}
          {this.state.isOwner && this.state.status === 0 && (
            <div
              className={
                this.state.users.length === 5
                  ? "startButton"
                  : "startButtonDisable"
              }
              onClick={() => {
                if (this.state.users.length !== 5) {
                  return;
                }

                this.props.socket.emit("startGame", { code: storage.id });
              }}
            >
              <h3 className="buttonText">{language.start}</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}
