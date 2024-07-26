import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      // batches: [],
      // batchIdx: 0,
      needRequest: true,
      // activity: 0,
    };

    this.batches = [];
    this.batchIdx = 0;
    this.activity = 0;

    this.newestQuestions = this.newestQuestions.bind(this);
    this.activeQuestions = this.activeQuestions.bind(this);
    this.unansweredQuestions = this.unansweredQuestions.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  //We can axios for the data here once SESSIONS WORK
  componentDidMount() {
    if (this.state.needRequest) {
      // this.state.activity = 0;
      this.activity = 0;
      this.newestQuestions();
    }
  }

  previous() {
    // this.state.needRequest = false;
    // this.state.activity = 1;
    this.activity = 1;
    this.getCorrectBatch();
    this.setState({ needRequest: false });
  }

  next() {
    // this.state.needRequest = false;
    // this.state.activity = 2;
    this.activity = 2;
    this.getCorrectBatch();
    this.setState({ needRequest: false });
  }

  newestQuestions() {
    // this.state.needRequest = true;
    let func = this.props.showError;
    axios
      .get("http://127.0.0.1:8000/home/newest/")
      .then((res) => {
        let qs = this.props.formulateQuestions(res.data);
        this.setState({ questions: qs, needRequest: true }); //set questions
      })
      .catch(function (error) {
        func();
      });
  }

  activeQuestions() {
    // this.state.needRequest = true;
    let func = this.props.showError;
    axios
      .get("http://127.0.0.1:8000/home/active/")
      .then((res) => {
        let qs = this.props.formulateQuestions(res.data);
        this.setState({ questions: qs, needRequest: true }); //set questions
      })
      .catch(function (error) {
        func();
      });
  }

  unansweredQuestions() {
    // this.state.needRequest = true;
    let func = this.props.showError;
    axios
      .get("http://127.0.0.1:8000/home/unanswered/")
      .then((res) => {
        let qs = this.props.formulateQuestions(res.data);
        this.setState({ questions: qs, needRequest: true }); //set questions
      })
      .catch(function (error) {
        func();
      });
  }

  formBatches() {
    let questions = this.state.questions;
    let numBatches = Math.ceil(questions.length / 5);
    let batches = [];
    if (numBatches > 0) {
      let idx = 0;
      for (let i = 0; i < numBatches; i++) {
        let batch = [];

        for (let j = 0; j < 5 && idx < questions.length; j++) {
          batch.push(questions[idx++]);
        }

        batches.push(batch);
      }
    }

    // this.state.batches = batches;
    this.batches = batches;
    // console.log(batches);
  }

  getCorrectBatch() {
    //activities: 0 means current batch, 1 means previous if any, 2 means next if any
    // let activity = this.state.activity;
    let activity = this.activity;
    // this.state.activity = 0;
    this.activity = 0;
    if (this.state.questions.length === 0) return this.state.questions;
    // let currBatchIdx = this.state.batchIdx;
    let currBatchIdx = this.batchIdx;
    // let maxBatchIdx = this.state.batches.length - 1;
    let maxBatchIdx = this.batches.length - 1;
    if (activity === 0 || (activity === 1 && currBatchIdx === 0)) {
      // return this.state.batches[currBatchIdx];
      return this.batches[currBatchIdx];
    } else if (activity === 1) {
      // this.state.batchIdx = --currBatchIdx;
      this.batchIdx = --currBatchIdx;
    } else if (activity === 2 && currBatchIdx === maxBatchIdx) {
      currBatchIdx = 0;
      // this.state.batchIdx = currBatchIdx;
      this.batchIdx = currBatchIdx;
    } else if (activity === 2) {
      // this.state.batchIdx = ++currBatchIdx;
      this.batchIdx = ++currBatchIdx;
    }

    // return this.state.batches[currBatchIdx];
    return this.batches[currBatchIdx];
  }

  render() {
    const { showAsk } = this.props;

    // let questions = this.getCorrectBatch();
    this.formBatches();
    let questions = this.getCorrectBatch();
    let numQuestions = this.state.questions.length;

    let qStr = "question";
    // let result = "";
    // if (numQuestions === 0) result = <h3>No Questions Found</h3>;
    if (numQuestions !== 1) qStr += "s";

    let isLoggedIn;
    if (Cookies.get("user")) {
      isLoggedIn = true;
    }
    // let batchIndex = this.state.batchIdx;
    let batchIndex = this.batchIdx;
    return (
      <section>
        <div id="home-body">
          {isLoggedIn && (
            <button
              onClick={() => showAsk()}
              id="askQuestion"
              className="button"
            >
              Ask Question
            </button>
          )}
          <h1 id="allquestions">All Questions</h1>
          <div id="bts">
            <h3>
              <span id="numQ">{numQuestions}</span> {qStr}
            </h3>
            <button id="new" onClick={this.newestQuestions}>
              Newest
            </button>
            <button id="act" onClick={this.activeQuestions}>
              Active
            </button>
            <button id="unans" onClick={this.unansweredQuestions}>
              Unanswered
            </button>
          </div>
          <br />
          {this.state.questions.length > 5 && (
            <div className="batchSection">
              <button className="questionNav" onClick={this.previous}>
                prev
              </button>
              <span id="batchIdx">Page {batchIndex + 1}</span>
              <button className="questionNav" onClick={this.next}>
                next
              </button>
            </div>
          )}
          <br />
          <hr />
          <div id="homeQuestionsList">{questions}</div>
        </div>
      </section>
    );
  }
}
