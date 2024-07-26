import React from "react";
import axios from "axios";
import CommentSection from "./commentSection";
import Post from "./postAnswer";
import Answer from "./answer";
import Cookies from "js-cookie";
import Vote from "./voteMechanism";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: this.props.ind,
      index: 0,
      views: 0,
      votes: 0,
      title: "",
      text: "",
      tags: [],
      answers: [],
      asked_by: "",
      ask_date_time: "",
      firstRender: 0,
      alreadyVoted: false,
      comments: [],
      // answerBatches: [],
      // batchIdx: 0,
      // activity: 0,
      rerender: false,
    };

    this.answerBatches = [];
    this.batchIdx = 0;
    this.activity = 0;

    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  //Or we can have a checkcookie function
  /*check  
    const cookieValue = Cookies.get("user");
    if (!cookieValue) {
      const btn = document.getElementById("logoutBtn");
      btn.click();
      alert("Cookie Expired, Please Log In Again");
    }*/
  //and calll it after post answer/comment/downwote etcc.

  componentDidMount() {
    if (this.state.firstRender === 0) {
      // this.state.firstRender = 1;
      this.setupQuestion(true);
    }
  }

  childDemandsRerender = () => {
    this.setupQuestion(false);
  };

  constructAnswer = (answer, i) => {
    return (
      <Answer
        formateDate={this.props.formateDate}
        key={i}
        text={answer.text}
        ans_by={answer.ans_by}
        date={answer.ans_date_time}
        id={answer._id}
        votes={answer.votes}
        comments={answer.comments}
        rerender={this.childDemandsRerender}
        showError={this.props.showError}
      />
    );
  };

  getAnswerComps = (answers) => {
    // console.log("list " + answers);
    let ansComps = [];
    for (let i = 0; i < answers.length; i++) {
      // console.log("hesadasdre " + answers[i]);
      ansComps.push(this.constructAnswer(answers[i], i));
    }

    return ansComps;
  };

  setupQuestion = (rerender) => {
    // console.log(this.state.idx);
    let ind = {
      indString: this.state.idx.toString(),
      uid: this.state.idx,
      rerender: rerender,
    };

    let func = this.props.showError;

    axios
      .post("http://127.0.0.1:8000/view", ind)
      .then((res) => {
        // console.log(res.data);
        // this.state.views = res.data.questions.views;
        // this.state.votes = res.data.questions.votes;
        // this.state.summary = res.data.questions.summary;
        // this.state.title = res.data.questions.title;
        // // this.state.answers = this.getAnswerComps(res.data.answers);
        // this.state.answers = res.data.answers.reverse();
        // this.state.asked_by = res.data.questions.asked_by;
        // this.state.ask_date_time = res.data.questions.ask_date_time;
        // this.state.text = res.data.questions.text;
        // this.state.alreadyVoted = res.data.questions.alreadyVoted;
        // this.state.tags = res.data.tagNames;
        // this.state.comments = res.data.comments;
        // console.log(this.state.tags);
        // console.log(this.state.comments);
        this.setState({ 
          firstRender: 1, rerender: false ,
          views: res.data.questions.views,
          votes: res.data.questions.votes,
          summary: res.data.questions.summary,
          title: res.data.questions.title,
          answers: res.data.answers.reverse(),
          asked_by: res.data.questions.asked_by,
          ask_date_time: res.data.questions.ask_date_time,
          text: res.data.questions.text,
          alreadyVoted: res.data.questions.alreadyVoted,
          tags: res.data.tagNames,
          comments: res.data.comments
        });
      })
      .catch(function (error) {
        func();
      });
  };

  formBatches() {
    let answers = this.state.answers;
    let numBatches = Math.ceil(answers.length / 5);
    let batches = [];
    if (numBatches > 0) {
      let idx = 0;
      for (let i = 0; i < numBatches; i++) {
        let batch = [];

        for (let j = 0; j < 5 && idx < answers.length; j++) {
          batch.push(answers[idx++]);
        }

        batches.push(batch);
      }
    }

    // this.state.answerBatches = batches;
    this.answerBatches = batches;
    // console.log(batches);
  }

  getCorrectBatch() {
    //activities: 0 means current batch, 1 means previous if any, 2 means next if any
    // let activity = this.state.activity;
    let activity = this.activity;
    // this.state.activity = 0;
    this.activity = 0;
    // let currBatchIdx = this.state.batchIdx;
    let currBatchIdx = this.batchIdx;
    // let maxBatchIdx = this.state.answerBatches.length - 1;
    let maxBatchIdx = this.answerBatches.length - 1;
    if (activity === 0 || (activity === 1 && currBatchIdx === 0)) {
      // return this.state.answerBatches[currBatchIdx];
      return this.answerBatches[currBatchIdx];
    } else if (activity === 1) {
      // this.state.batchIdx = --currBatchIdx;
      this.batchIdx = --currBatchIdx;
    } else if (activity === 2 && currBatchIdx === maxBatchIdx) {
      // console.log("HI");
      currBatchIdx = 0;
      // this.state.batchIdx = currBatchIdx;
      this.batchIdx = currBatchIdx;
    } else if (activity === 2) {
      // this.state.batchIdx = ++currBatchIdx;
      this.batchIdx = ++currBatchIdx;
    }

    // return this.state.answerBatches[currBatchIdx];
    return this.answerBatches[currBatchIdx];
  }

  previous() {
    // this.state.needRequest = false;
    // this.state.activity = 1;
    this.activity = 1;
    this.setState({ rerender: true });
    // this.getCorrectBatch();
    // this.setState({ needRequest: false });
  }

  next() {
    // this.state.needRequest = false;
    // this.state.activity = 2;
    this.activity = 2;
    this.setState({ rerender: true });
    // this.getCorrectBatch();
    // this.setState({ needRequest: false });
  }

  render() {
    const { showAsk } = this.props;
    const tags = this.state.tags;
    const tagNames = [];
    for (let i = 0; i < tags.length; i++) {
      tagNames.push(
        <span key={i} className={"indiTagView"}>
          {tags[i]}
        </span>
      );
    }

    // console.log(this.state.comments);
    // let comments = this.state.comments;

    // let ansComps = this.state.answers;
    this.formBatches();
    let answers = this.getCorrectBatch();
    let ansComps = <h1 id="anstitle">0 Answers.</h1>;
    // let numAnswers = 0;
    if (answers !== undefined) {
      ansComps = this.getAnswerComps(answers);
    }
    // let ansComps = this.getAnswerComps(this.state.answerBatches[this.state.batchIdx]);
    let dat = this.state.ask_date_time;
    let isLoggedIn;
    if (Cookies.get("user")) {
      isLoggedIn = true;
    }

    return (
      <div id="view-body">
        <div id="metaRow">
          <span id="questionTitleView">{this.state.title}</span>
          {isLoggedIn && (
            <button id="askQuestion" onClick={() => showAsk()}>
              Ask Question
            </button>
          )}
        </div>
        <div id="detailRow">
          <span id="numViewsView">{this.state.views} views</span>
          <span
            id="questionDetailsView"
            dangerouslySetInnerHTML={{ __html: this.state.text }}
          >
            {}
          </span>
          <span id="asker-view">
            {this.state.asked_by}{" "}
            <span id="date">
              <br />
              asked {dat}
            </span>
          </span>
        </div>
        <br />

        <div id="newRow">
          <span id="numAnswersView">{ansComps.length} answers</span>
          <span id="questionSummary">Summary: {this.state.summary}</span>

            <Vote
              votes={this.state.votes}
              objId={this.state.idx}
              rerender={this.childDemandsRerender}
              showError={this.props.showError}
            ></Vote>
        </div>

        <br />
        <br />
        <div>{tagNames}</div>
        <br />
        <br />
        <CommentSection
          rerender={this.childDemandsRerender}
          // comments={comments}
          id={this.state.idx}
          showError={this.props.showError}
        ></CommentSection>
        <br />
        <hr />
        <h1 id="anstitle">Post New Answer</h1>
        {isLoggedIn && (
          <Post
            qid={this.state.idx}
            findIndices={this.props.findIndices}
            rerender={this.childDemandsRerender}
            showError={this.props.showError}
          />
        )}
        {!isLoggedIn && <h1>Login to answer the question!</h1>}
        <br />
        <hr />
        <h1 id="anstitle">All Answers</h1>
        {answers !== undefined && this.state.answers.length > 5 && (
          <div className="batchSection">
            <button className="questionNav" onClick={this.previous}>
              previous answers
            </button>
            <span id="batchIdx">Page {this.batchIdx + 1}</span>
            <button className="questionNav" onClick={this.next}>
              next answers
            </button>
          </div>
        )}
        <div id="ansList">
          <br />
          {ansComps}
        </div>
        {/* {isLoggedIn && (<button onClick={() => showPost(this.state.idx)} id="answerBtn">
          Answer Question
        </button>)} */}
      </div>
    );
  }
}
