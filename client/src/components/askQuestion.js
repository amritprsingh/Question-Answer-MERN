import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default class Ask extends React.Component {
  componentDidMount() {}
  handleOnSubmit = async (
    title,
    text,
    summary,
    tags,
    answers,
    asked_by,
    ask_date_time,
    views,
    votes,
    comments
  ) => {
    let data = {
      title: title,
      text: text,
      summary: summary,
      tags: tags,
      answers: answers,
      asked_by: asked_by,
      ask_date_time: ask_date_time,
      views: views,
      votes: votes,
      comments: comments,
    };
    let func = this.props.showError;
    await axios.post("http://127.0.0.1:8000/ask", data).catch(function (error) {
      func();
    });
  };

  resetFormQ() {
    document.getElementById("qtText").value = "";
    document.getElementById("qtextText").value = "";
    document.getElementById("tagsText").value = "";
    document.getElementById("qsumText").value = "";
    document.getElementById("qtError").innerHTML = "";
    document.getElementById("qsumError").value = "";
    document.getElementById("qtTextError").innerHTML = "";
    document.getElementById("tagsTextError").innerHTML = "";
  }

  postQuestion = async (showFunc) => {
    //alert("hello");
    let error = 0;
    const nonDuplicate = [];
    if (document.getElementById("qtText").value.length > 50) {
      document.getElementById("qtError").innerHTML = "Too Many Characters";
      error = 1;
    } else {
      document.getElementById("qtError").innerHTML = "";
    }
    if (document.getElementById("qtText").value.length === 0) {
      document.getElementById("qtError").innerHTML =
        "Question Title Can Not Be Empty";
      error = 1;
    } else {
      document.getElementById("qtError").innerHTML = "";
    }
    let summary = document.getElementById("qsumText").value;
    if (summary.length === 0) {
      document.getElementById("qsumError").innerHTML =
        "Question Summary Can Not Be Empty";
      error = 1;
    } else if (summary.length > 140) {
      document.getElementById("qsumError").innerHTML = "Too Many Characters";
      error = 1;
    } else {
      document.getElementById("qsumError").innerHTML = "";
    }
    let text = document.getElementById("qtextText").value;
    if (text.length === 0) {
      document.getElementById("qtTextError").innerHTML =
        "Question Text Can Not Be Empty";
      error = 1;
    } else {
      let res = this.props.findIndices(text);
      // console.log(res);
      if (res === -1) {
        document.getElementById("qtTextError").innerHTML =
          "Invalid HyperLink Configuration, Use [hyperlinkName nonEmpty ](link nonEmpty starts with https:// or http://)";
        error = 1;
      } else if (res.length !== 0) {
        text = res;
        document.getElementById("qtTextError").innerHTML = "";
      } else {
        document.getElementById("qtTextError").innerHTML = "";
      }
    }

    if (document.getElementById("tagsText").value.length !== 0) {
      let lenError = 0;
      const tags = document
        .getElementById("tagsText")
        .value.toLowerCase()
        .split(" ");
      nonDuplicate[0] = tags[0];
      for (let i = 0; i < tags.length; i++) {
        let include = 0;
        for (let j = 0; j < nonDuplicate.length; j++) {
          if (nonDuplicate[j] === tags[i]) include = 1;
        }
        if (include === 0 && tags[i].length <= 20) nonDuplicate.push(tags[i]);
        else if (tags[i].length > 20) {
          lenError = 1;
        }
      }
      if (nonDuplicate.length > 5 && lenError === 1) {
        document.getElementById("tagsTextError").innerHTML =
          "Only 5 Unique Tags Allowed and Tags Can Not Have More Than 20 Characters";
        error = 1;
      } else if (nonDuplicate.length > 5) {
        document.getElementById("tagsTextError").innerHTML =
          "Only 5 Unique Tags Allowed";
        error = 1;
      } else if (lenError === 1) {
        document.getElementById("tagsTextError").innerHTML =
          "Tags Can Not Have More Than 20 Characters";
        error = 1;
      } else {
        document.getElementById("tagsTextError").innerHTML = "";
      }
    }
    let username = Cookies.get("user");

    let tags = [];
    let result = "";
    if (nonDuplicate.length !== 0 && error !== 1) {
      let func2 = this.props.showError;
      await axios
        .post("http://127.0.0.1:8000/ask/tags", {
          nonDuplicate: nonDuplicate,
          user: username,
        })
        .then((res) => {
          // console.log("AskQuestion are you working?");
          tags = res.data.array;
          result = res.data.result;
        })
        .catch(function (error) {
          func2();
        });
    }

    if (result === "Error") {
      error = 1;
      document.getElementById("tagsTextError").innerHTML =
        "Not Enough Reputation to Add New Tags";
    } else {
      document.getElementById("tagsTextError").innerHTML = "";
    }

    // let tagIds = this.props.getTagIds(nonDuplicate);

    if (error !== 1) {
      this.handleOnSubmit(
        document.getElementById("qtText").value,
        text,
        summary,
        tags,
        [],
        username,
        new Date(),
        0,
        0,
        []
      );

      showFunc();
    }
  };

  render() {
    //const isLoggedIn = localStorage.getItem("isLoggedIn");
    const { showHome } = this.props;
    return (
      <div>
        <div id="ask-body" className="ask-body">
          <form id="askQ">
            <div className="headAskQ">
              Question Title<sup>*</sup>
            </div>
            <br />
            <div id="qtLimit" className="miniAskQ">
              Limit Title To 50 Characters Or Less
            </div>
            <input type="text" id="qtText" className="askQForm" />
            <br />
            <span id="qtError" className="miniAskQ"></span>

            <div className="headAskQ">
              Question Summary<sup>*</sup>
            </div>
            <br />
            <div id="qsumDet" className="miniAskQ">
              Limit Summary to 140 Characters or Less
            </div>
            <textarea id="qsumText" className="askQForm"></textarea>
            <br />
            <span id="qsumError" className="miniAskQ"></span>

            <div className="headAskQ">
              Question Text<sup>*</sup>
            </div>
            <br />
            <div id="qtextDet" className="miniAskQ">
              Add Details
            </div>
            <textarea id="qtextText" className="askQForm"></textarea>
            <br />
            <span id="qtTextError" className="miniAskQ"></span>

            <div className="headAskQ">
              Tags<sup>*</sup>
            </div>
            <br />
            <div id="tagsWhite" className="miniAskQ">
              Add Keywords Separated By Whitespace
            </div>
            <input type="text" id="tagsText" className="askQForm" />
            <br />
            <span id="tagsTextError" className="miniAskQ"></span>

            <div>
              <button
                onClick={() => this.postQuestion(showHome)}
                id="postQ"
                className="post"
              >
                Post Question
              </button>
              <span id="star">
                <sup>*</sup> indicates mandatory fields
              </span>
            </div>
            {/*<div id="test"></div>*/}
          </form>
        </div>
      </div>
    );
  }
}
