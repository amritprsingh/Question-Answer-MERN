import React from "react";
import Banner from "./banner.js";
import Cookies from "js-cookie";

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rerender: false };
  }

  componentDidMount() {}

  render() {
    // const isLoggedIn = localStorage.getItem("isLoggedIn");
    const isLoggedIn = Cookies.get("user");
    if (!isLoggedIn) {
      return (
        <div>
          <Banner showSearchBar={false} />;
          <div className="weltext">
            <h1>Welcome To FakeStackOverFlow!</h1>
            <h3>Please Select One of the Following Options to Continue</h3>
          </div>
          <div className="welbutton-container">
            <button onClick={this.props.showRegister} className="welbutton">
              Register
            </button>
            <button onClick={this.props.showLogin} className="welbutton">
              Login
            </button>
            <button onClick={this.props.showHome} className="welbutton">
              Guest
            </button>
          </div>
        </div>
      );
    }
  }
}
