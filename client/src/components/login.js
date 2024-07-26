import React from "react";
import Banner from "./banner.js";
import Cookies from "js-cookie";
import axios from "axios";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showP: false,
      passwd: "",
      user: "",
    };
  }

  componentDidMount() {
    // console.log(localStorage.getItem("isLoggedIn"));
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      // Redirect the user away from the login page if already logged in
      // window.location.href = "/homepage"; // Change '/dashboard' to your desired redirect route
    }
  }

  handleOnSubmit = async (email, pass) => {
    let data = {
      email: email,
      pass: pass,
    };

    let x = 0;
    let u = "";

    //axios.defaults.withCredentials = true;
    //let token;
    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/login", data, { withCredentials: true })
      .then((res) => {
        x = res.data.result;
        u = res.data.username;
      })
      .catch(function (error) {
        console.log("Error");

        func();
      });
    //this.showError();

    return [x, u];
  };

  showError = () => {
    console.log("Here");
    alert("Server Error : Please Log In Again");
    this.props.setLogIn(false, "");
    Cookies.remove("user");
  };

  checkEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  togglePassword = () => {
    this.setState((prevS) => ({
      showP: !prevS.showP,
    }));
  };

  logIn = async () => {
    let error = 0;
    let email = document.getElementById("email").value;
    if (email.length === 0) {
      document.getElementById("emailError").innerHTML =
        "Email Can Not Be Empty";
      error = 1;
    } else if (this.checkEmail(email) === false) {
      document.getElementById("emailError").innerHTML = "Email of Invalid Form";
      error = 1;
    } else {
      document.getElementById("emailError").innerHTML = "";
    }
    let pass = document.getElementById("pass").value;
    if (pass.length === 0) {
      document.getElementById("passError").innerHTML =
        "Password Can Not Be Empty";
      error = 1;
    } else {
      document.getElementById("passError").innerHTML = "";
    }

    let arr;
    let result;
    if (error !== 1) {
      arr = await this.handleOnSubmit(email, pass);
      result = arr[0];
    }

    if (result === 0 && error === 0) {
      document.getElementById("emailError").innerHTML =
        "Email Is Not Registered";
      document.getElementById("passError").innerHTML = "";
    } else if (result === 1 && error === 0) {
      document.getElementById("passError").innerHTML = "Incorrect Password";
      document.getElementById("emailError").innerHTML = "";
    } else if (error === 0) {
      document.getElementById("passError").innerHTML = "";
      document.getElementById("emailError").innerHTML = "";
      const expiry = new Date();
      expiry.setTime(expiry.getTime() + 60 * 60 * 1000); // 1 hour in milliseconds SET TIME HERE
      Cookies.set("user", arr[1], {
        expires: expiry,
        //secure: true,
      });

      //WONT NEED THIS ONCE SESSIONS WORK
      this.props.setLogIn(true, arr[1]);
    }
  };

  render() {
    //const isLoggedIn = localStorage.getItem("isLoggedIn");
    //const username = localStorage.getItem("username");
    const { showP, passwd } = this.state;

    return (
      <div>
        <Banner showSearchBar={false} showError={this.props.showError} />;
        <div className="reglogcontainer">
          <div className="form">
            <header className="reglogheader">Login</header>
            <form className="reglogform" action="#">
              <input
                type="text"
                className="regloginput"
                placeholder="Enter your email"
                id="email"
              />
              <div className="regLogError" id="emailError"></div>
              <input
                type={showP ? "text" : "password"}
                value={passwd}
                onChange={(e) => this.setState({ passwd: e.target.value })}
                className="regloginput"
                placeholder="Enter your password"
                id="pass"
              />
              <input
                type="checkbox"
                checked={showP}
                onChange={this.togglePassword}
                className="check"
              />
              <span id="showP">Show Password</span>
              <div className="regLogError" id="passError"></div>
            </form>

            <button onClick={this.logIn} className="reglogbutton">
              Login
            </button>
            <button
              onClick={this.props.showWelcome}
              className="reglogbutton"
              id="cancelBtn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
