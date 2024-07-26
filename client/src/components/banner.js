import React from "react";
import SearchBar from "./searchBar";
import SideBar from "./sideBar";
import axios from "axios";
import Cookies from "js-cookie";
export default class Banner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rerender: false, username: this.props.username };
  }

  logOut = async () => {
    let func = this.props.showError;
    let err = 0;
    await axios.get("http://127.0.0.1:8000/logout").catch(function (error) {
      func();
      err = 1;
    });
    if (err === 0) {
      this.props.setLogIn(false, "");
      Cookies.remove("user");
    }
  };

  componentsDidMount() {
    const cookieValue = Cookies.get("user");
    if (!cookieValue) {
      const btn = document.getElementById("logoutBtn");
      btn.click();
    }
  }

  render() {
    let isLoggedIn;

    if (Cookies.get("user")) {
      isLoggedIn = true;
    }

    let isHomePage = this.props.isHome;

    return (
      <div className="banner">
        {isLoggedIn && (
          <button onClick={this.logOut} id="logoutBtn" className="reglogbutton">
            Logout
          </button>
        )}
        {!isLoggedIn && isHomePage && (
          <button
            onClick={this.props.showWelcome}
            className="reglogbutton"
            id="gobackBtn"
          >
            Welcome Page
          </button>
        )}
        {this.props.showSearchBar && (
          <SideBar
            linkClicked={this.props.linkClicked}
            showHome={this.props.showHome}
            showTags={this.props.showTags}
            showError={this.props.showError}
          />
        )}
        {isLoggedIn && (
          /*eslint-disable-next-line jsx-a11y/anchor-is-valid*/
          <a
            onClick={() => this.props.showOrigProfile()}
            id="profileLink"
            href="#"
          >
            Profile
          </a>
        )}
        {this.props.showSearchBar && !isLoggedIn && (
          <h1 id="app-Title-notWelcome">Fake Stack Overflow</h1>
        )}
        {!this.props.showSearchBar && (
          <h1 id="app-Title-welcome">Fake Stack Overflow</h1>
        )}
        {isLoggedIn && <h1 id="app-Title-loggedIn">Fake Stack Overflow</h1>}
        {this.props.showSearchBar && (
          <SearchBar
            showSearch={this.props.showSearch}
            searchUpdate={this.props.searchUpdate}
            showError={this.props.showError}
          />
        )}
      </div>
    );
  }
}
