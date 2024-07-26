import React from "react";
import Banner from "./banner.js";

import axios from "axios";

export default class Register extends React.Component {
  componentDidMount() {
    this.resetForm();
  }

  resetForm() {
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pass").innerHTML = "";
    document.getElementById("confpass").innerHTML = "";
    document.getElementById("firstnameError").innerHTML = "";
    document.getElementById("lastnameError").innerHTML = "";
    document.getElementById("userNameError").value = "";
    document.getElementById("emailError").value = "";
    document.getElementById("passError").innerHTML = "";
    document.getElementById("confpassError").innerHTML = "";
  }

  handleOnSubmit = async (first, last, userName, email, pass) => {
    let data = {
      first: first,
      last: last,
      userName: userName,
      email: email,
      pass: pass,
    };
    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/register", data)
      .then((res) => {})
      .catch(function (error) {
        func();
      });
    this.props.showLogin();
  };

  checkEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  checkPass = (pass, checkArray) => {
    for (let i = 0; i < checkArray.length; i++) {
      if (pass.includes(checkArray[i])) {
        return true;
      }
    }
    return false;
  };

  emailExists = async (email) => {
    let data = { email: email };
    let x = 0;
    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/register_email", data)
      .then((res) => {
        x = res.data.result;
      })
      .catch(function (error) {
        func();
      });
    return x;
  };

  createUser = async () => {
    let error = 0;
    let first = document.getElementById("firstname").value;
    if (first.length === 0) {
      document.getElementById("firstnameError").innerHTML =
        "First Name Can Not Be Empty";
      error = 1;
    } else if (first.length > 25) {
      document.getElementById("firstnameError").innerHTML =
        "Length of First Name is Too Long, Please Abbreviate";
      error = 1;
    } else {
      document.getElementById("firstnameError").innerHTML = "";
    }
    let last = document.getElementById("lastname").value;
    if (last.length === 0) {
      document.getElementById("lastnameError").innerHTML =
        "Last Name Can Not Be Empty";
      error = 1;
    } else if (last.length > 25) {
      document.getElementById("lastnameError").innerHTML =
        "Length of Last Name is Too Long, Please Abbreviate";
      error = 1;
    } else {
      document.getElementById("lastnameError").innerHTML = "";
    }

    let userName = document.getElementById("username").value;
    if (userName.length === 0) {
      document.getElementById("userNameError").innerHTML =
        "UserName Can Not Be Empty";
      error = 1;
    } else if (userName.length > 20) {
      document.getElementById("userNameError").innerHTML =
        "UserName is Too Long";
      error = 1;
    } else {
      document.getElementById("userNameError").innerHTML = "";
    }

    let email = document.getElementById("email").value;
    if (email.length === 0) {
      document.getElementById("emailError").innerHTML =
        "Email Can Not Be Empty";
      error = 1;
    } else if (this.checkEmail(email) === false) {
      document.getElementById("emailError").innerHTML = "Email of Invalid Form";
      error = 1;
    } else if ((await this.emailExists(email)) === 1) {
      document.getElementById("emailError").innerHTML =
        "Email Exists for Another User";
      error = 1;
    } else {
      document.getElementById("emailError").innerHTML = "";
    }

    let pass = document.getElementById("pass").value;
    if (error === 1) {
      document.getElementById("passError").innerHTML =
        "Please First Fix the Previous Fields";
      error = 1;
    } /*else if (pass.length < 8) {
      document.getElementById("passError").innerHTML =
        "Password Too Short (>= 8 Characters)";
      error = 1;
    } */ else if (
      this.checkPass(pass, [first, last, userName, email.split("@")[0]]) ===
      true
    ) {
      document.getElementById("passError").innerHTML =
        "Password includes First/Last/User/Email Name";
      error = 1;
    } else {
      document.getElementById("passError").innerHTML = "";
    }

    let confPass = document.getElementById("confpass").value;
    if (confPass !== pass) {
      document.getElementById("confpassError").innerHTML =
        "Password Do Not Match";
      error = 1;
    } else {
      document.getElementById("confpassError").innerHTML = "";
    }

    if (error !== 1) {
      this.handleOnSubmit(first, last, userName, email, pass);
    }
  };

  render() {
    return (
      <div>
        <Banner showSearchBar={false} />;
        <div className="regcontainer">
          <div className="form">
            <header className="reglogheader">Register</header>
            <form className="reglogform" action="#">
              <input
                type="text"
                className="regloginput"
                placeholder="Enter your first name"
                id="firstname"
              />
              <div className="regLogError" id="firstnameError"></div>
              <input
                type="text"
                className="regloginput"
                placeholder="Enter your last name"
                id="lastname"
              />
              <div className="regLogError" id="lastnameError"></div>
              <input
                type="text"
                className="regloginput"
                placeholder="Enter your username"
                id="username"
              />
              <div className="regLogError" id="userNameError"></div>
              <input
                type="text"
                className="regloginput"
                placeholder="Enter your email"
                id="email"
              />
              <div className="regLogError" id="emailError"></div>
              <input
                type="password"
                className="regloginput"
                placeholder="Create a password"
                id="pass"
              />
              <div className="regLogError" id="passError"></div>
              <input
                type="password"
                className="regloginput"
                placeholder="Confirm your password"
                id="confpass"
              />
              <div className="regLogError" id="confpassError"></div>
            </form>
            <button onClick={this.createUser} className="reglogbutton">
              Signup
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
