import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qid: this.props.qid,
    };

    this.postAnswer = this.postAnswer.bind(this);
  }

  handleOnSubmit = (text) => {
    let username = Cookies.get("user");
    let data = {
      text: text,
      ans_by: username,
      qid: this.state.qid,
    };
    let func = this.props.showError;
    axios
      .post("http://127.0.0.1:8000/post", data)
      .then((res) => {
        if(res.data === "NOT OKAY") {
          document.getElementById("qtTextAnsError").innerHTML = "*Your reputation is not good. Must be reputation > 50 to post answer.";
        } else {
          document.getElementById("qtextTextAns").value = "";
        }
        
        this.props.rerender();
      })
      .catch(function (error) {
        func();
      });
  };

  postAnswer() {
    let error = 0;

    let text = document.getElementById("qtextTextAns").value;
    if (text.length === 0) {
      document.getElementById("qtTextAnsError").innerHTML =
        "Answer Text Can Not Be Empty";
      error = 1;
    } else {
      let res = this.props.findIndices(text);
      if (res === -1) {
        document.getElementById("qtTextAnsError").innerHTML =
          "Invalid HyperLink Configuration, Use [hyperlinkName nonEmpty ](link nonEmpty starts with https:// or http://)";
        error = 1;
      } else if (res.length !== 0) {
        text = res;
        document.getElementById("qtTextAnsError").innerHTML = "";
      } else {
        document.getElementById("qtTextAnsError").innerHTML = "";
      }
    }

    if (error !== 1) {
      this.handleOnSubmit(text);
    }
  }

  render() {
    return (
      <div id="answer-body">
        <form id="ansQ">
          <div className="headAskQ">
            Post Answer:<sup>*</sup>
          </div>
          <br />
          <textarea id="qtextTextAns" className="askQForm"></textarea>
          <br />
          <span id="qtTextAnsError" className="miniAskQ"></span>

          <div>
            <button onClick={this.postAnswer} id="postAns" className="post">
              Post Answer
            </button>

            <span id="star">
              <sup>*</sup> indicates mandatory fields
            </span>
          </div>
        </form>

        <br />
        <br />
        <hr />
        <br />
      </div>
    );
  }
}
