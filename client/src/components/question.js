import React from "react";
import axios from "axios";
import Cookie from "js-cookie";

export default class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tagNames: [] };
  }

  handle = async (index) => {
    this.props.showView(index);
  };

  render() {
    let numAnswers = this.props.numAnswers;
    let numViews = this.props.numViews;
    let numVotes = this.props.numVotes;
    let questionTitle = this.props.questionTitle;
    let asker = this.props.asker;
    let date = this.props.date;
    let id = this.props.id;

    const tags = this.props.tags;
    const tagElem = [];
    for (let i = 0; i < tags.length; i++) {
      tagElem.push(
        <span key={i} className={"indiTag"}>
          {tags[i]}
        </span>
      );
    }

    return (
      <section>
        <div className="homeQuestion">
          <div className="statCol">
            {numAnswers} answers<br></br>
            {numViews} views<br></br>
            {numVotes} votes<br></br>
          </div>

          <span className="questionTitleView">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a onClick={() => this.props.showView(id)}>{questionTitle}</a>
            <br />
            <br />
            {tagElem}
          </span>

          <span>
            <span
              style={{ fontSize: "large", color: "red", fontWeight: "bold" }}
            >
              {asker}
            </span>
            <span>. asked {this.props.formateDate(date)}</span>
          </span>
        </div>

        <br></br>
        <hr></hr>
      </section>
    );
  }
}

export class QuestionProfile extends React.Component {
  handle = async (index) => {
    this.props.showView(index);
  };

  render() {
    let numAnswers = this.props.numAnswers;
    let numViews = this.props.numViews;
    let numVotes = this.props.numVotes;
    let questionTitle = this.props.questionTitle;
    let asker = this.props.asker;
    let date = this.props.date;

    const tags = this.props.tagnames;
    const tagElem = [];
    for (let i = 0; i < tags.length; i++) {
      tagElem.push(
        <span key={i} className={"indiTag"}>
          {tags[i]}
        </span>
      );
    }

    return (
      <section>
        <div className="homeQuestion">
          <div className="statCol">
            {numAnswers} answers<br></br>
            {numViews} views<br></br>
            {numVotes} votes<br></br>
          </div>

          <span className="questionTitleView" id="qtView">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a
              onClick={() =>
                this.props.showProfileQuestion(this.props.question)
              }
            >
              {questionTitle}
            </a>
            <br />
            <br />
            {tagElem}
          </span>

          <span>
            <span
              style={{ fontSize: "large", color: "red", fontWeight: "bold" }}
            >
              {asker}
            </span>
            <span>. asked {this.props.formateDate(date)}</span>
          </span>
        </div>
        {this.props.showDelete && (
          <button
            id="delBtn"
            className="reglogbutton"
            onClick={() =>
              this.props.showVerifyDeletion(
                this.props.id,
                this.props.question,
                0
              )
            }
          >
            Delete Question
          </button>
        )}
        <br></br>

        <hr></hr>
      </section>
    );
  }
}

export class QuestionAnswerProfile extends React.Component {
  handle = async (index) => {
    this.props.showView(index);
  };

  render() {
    let numAnswers = this.props.numAnswers;
    let numViews = this.props.numViews;
    let numVotes = this.props.numVotes;
    let questionTitle = this.props.questionTitle;
    let asker = this.props.asker;
    let date = this.props.date;

    const tags = this.props.tagnames;
    const tagElem = [];
    for (let i = 0; i < tags.length; i++) {
      tagElem.push(
        <span key={i} className={"indiTag"}>
          {tags[i]}
        </span>
      );
    }

    return (
      <section>
        <div className="homeQuestion">
          <div className="statCol">
            {numAnswers} answers<br></br>
            {numViews} views<br></br>
            {numVotes} votes<br></br>
          </div>

          <span className="questionTitleView">
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a
            /*onClick={() =>
                this.props.showProfileQuestion(this.props.question)
              }*/
            >
              {questionTitle}
            </a>
            <br />
            <br />
            {tagElem}
          </span>

          <span>
            <span
              style={{ fontSize: "large", color: "red", fontWeight: "bold" }}
            >
              {asker}
            </span>
            <span>. asked {this.props.formateDate(date)}</span>
          </span>
        </div>

        <br></br>
        <hr></hr>
      </section>
    );
  }
}

export class ProfileQuestion extends React.Component {
  componentDidMount() {
    this.resetFormQ();
  }
  formatTags(stringTag) {
    let ret = "";

    for (let i = 0; i < stringTag.length - 1; i++) {
      ret += stringTag[i] + " ";
    }
    ret += stringTag[stringTag.length - 1];
    return ret;
  }

  resetFormQ() {
    document.getElementById("qtError").innerHTML = "";
    document.getElementById("qtTextError").innerHTML = "";
    document.getElementById("tagsTextError").innerHTML = "";
    document.getElementById("qsumError").innerHTML = "";
  }

  handleOnSubmit = async (title, text, summary, tags, oldTags) => {
    let data = {
      id: this.props.question.id,
      title: title,
      text: text,
      summary: summary,
      tags: tags,
    };

    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/updateQuestion", data)
      .catch(function (error) {
        func();
      });
    this.goBack();
  };

  updateQuestion = async (showFunc) => {
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
    let username = this.props.question.askedBy;

    let tags = [];
    let result = "";
    let func = this.props.showError;
    if (nonDuplicate.length !== 0 && error !== 1) {
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
          func();
        });
    }

    if (result === "Error") {
      error = 1;
      document.getElementById("tagsTextError").innerHTML =
        "Not Enough Reputation to Add New Tags";
    } else {
      document.getElementById("tagsTextError").innerHTML = "";
      await axios
        .post("http://127.0.0.1:8000/cleanTags", {
          oldTags: this.props.question.names,
          user: username,
        })
        .catch(function (error) {
          func();
        });
    }

    // let tagIds = this.props.getTagIds(nonDuplicate);

    if (error !== 1) {
      this.handleOnSubmit(
        document.getElementById("qtText").value,
        text,
        summary,
        tags,
        this.props.question.names
      );

      //showFunc();
    }
  };

  goBack() {
    if (this.props.username !== Cookie.get("user"))
      this.props.showProfile(this.props.username);
    else {
      this.props.showOrigProfile(this.props.username);
    }
  }
  render() {
    let tags = this.formatTags(this.props.question.names);
    let title = this.props.question.title;
    let summary = this.props.question.summary;
    let text = this.props.question.text;

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
            <input
              type="text"
              id="qtText"
              className="askQForm"
              defaultValue={title}
            />
            <br />
            <span id="qtError" className="miniAskQ"></span>

            <div className="headAskQ">
              Question Summary<sup>*</sup>
            </div>
            <br />
            <div id="qsumDet" className="miniAskQ">
              Limit Summary to 140 Characters or Less
            </div>
            <textarea
              id="qsumText"
              className="askQForm"
              defaultValue={summary}
            ></textarea>
            <br />
            <span id="qsumError" className="miniAskQ"></span>

            <div className="headAskQ">
              Question Text<sup>*</sup>
            </div>
            <br />
            <div id="qtextDet" className="miniAskQ">
              Add Details
            </div>
            <textarea
              id="qtextText"
              className="askQForm"
              defaultValue={text}
            ></textarea>
            <br />
            <span id="qtTextError" className="miniAskQ"></span>

            <div className="headAskQ">
              Tags<sup>*</sup>
            </div>
            <br />
            <div id="tagsWhite" className="miniAskQ">
              Add Keywords Separated By Whitespace
            </div>
            <input
              type="text"
              id="tagsText"
              className="askQForm"
              defaultValue={tags}
            />
            <br />
            <span id="tagsTextError" className="miniAskQ"></span>

            <div>
              <span>
                <button
                  onClick={() => this.updateQuestion()}
                  id="postQ"
                  className="postProf"
                >
                  Update Question
                </button>

                <button
                  onClick={() => this.goBack()}
                  id="cancelQ"
                  className="postProf"
                >
                  Cancel
                </button>
                <span id="star">
                  <sup>*</sup> indicates mandatory fields
                </span>
              </span>
            </div>
            {/*<div id="test"></div>*/}
          </form>
        </div>
      </div>
    );
  }
}
