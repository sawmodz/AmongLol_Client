import React from "react";
import "./css/Home.css";

let language = "";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    const lg = window.navigator.language;
    if (lg !== "fr-FR") {
      language = require("../Language/base.json");
      return;
    }
    language = require("../Language/" + lg + ".json");
  }
  render() {
    return (
      <div className="main">
        <h1 className="title">{language.Title}</h1>
        <div className="joinBox">
          <div className="joinpartybox">
            <h2 className="joinpartytitle">{language.JoinParty}</h2>
            <div>
              <h3>{language.Nickname}</h3>
              <input type="text" />
            </div>

            <div>
              <h3>{language.Code}</h3>
              <input type="text" />
            </div>

            <div className="joinButton">
              <h4 className="joinButtonText">{language.Join}</h4>
            </div>
          </div>

          <div className="joinpartybox">
            <h2 className="joinpartytitle">{language.CreateParty}</h2>
            <div>
              <h3>{language.Nickname}</h3>
              <input type="text" />
            </div>
            <div className="joinButton">
              <h4 className="joinButtonText">{language.CreateParty}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
