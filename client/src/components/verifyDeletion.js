import React from "react";

import axios from "axios";
import { Users } from "./profile";
import Cookie from "js-cookie";

export default class VerifyDeletion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: this.props.deletionId,
      element: this.props.deletionElement,
      type: this.props.deletionElementType,
    };
  }

  delete = () => {
    if (this.state.type === 0) this.deleteQuestion();
    if (this.state.type === 2) this.deleteUser();
  };

  deleteUser = async () => {
    let data = {
      username: this.state.idx,
      email: this.state.element,
    };
    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/deleteUser", data, {
        withCredentials: true,
      })
      .catch(function (error) {
        func();
      });
    this.goBack();
  };

  deleteQuestion = async () => {
    let data = {
      index: this.state.idx,
    };
    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/deleteQuestion", data, {
        withCredentials: true,
      })
      .catch(function (error) {
        func();
      });

    this.goBack();
  };

  goBack() {
    if (this.props.username !== Cookie.get("user"))
      this.props.showProfile(this.props.username);
    else {
      this.props.showOrigProfile(this.props.username);
    }
  }

  render() {
    let elem;
    const { element, type } = this.state;
    if (type === 0) {
      //Question
      elem = this.props.formulateProfileQuestions([element], false);
    }

    if (type === 2) {
      elem = <Users username={this.state.idx} />;
    }

    let statement = type === 0 ? " question" : " user";
    // console.log(text + " " + ans_by + " " + date + " " + id);

    return (
      <div>
        {type !== 4 && (
          <div id="verifyCont">
            <h1 id="delh1">Are You Sure You Want to Delete?</h1>
            <h2 id="delh2">You are deleting {statement} : </h2>
            <div className="unclickable">{elem}</div>
            <button
              className="reglogbutton"
              style={{ marginRight: "2%", padding: "1%" }}
              onClick={() => this.delete()}
            >
              Yes, Confirm Deletion
            </button>
            <button
              className="reglogbutton"
              onClick={() => this.goBack()}
              style={{ padding: "1%" }}
            >
              No, Go Back
            </button>
          </div>
        )}
      </div>
    );
  }
}
