import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      // batches: [],
      // batchIdx: 0,
      needRequest: true,
      // activity: 0,
      searchFound: 1,
    };

    this.activity = 0;
    this.batchIdx = 0;
    this.batches = [];

    this.newestQuestions = this.newestQuestions.bind(this);
    this.activeQuestions = this.activeQuestions.bind(this);
    this.unansweredQuestions = this.unansweredQuestions.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
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

  componentDidMount() {
    if (this.state.needRequest || this.state.phrase !== this.props.phrase) {
      if (this.state.phrase !== this.props.phrase) {
        // this.state.searchFound = 0;
        this.searchFound = 0;
      }

      if (this.searchFound === 0) {
        // this.state.activity = 0;
        this.activity = 0;
        this.newestQuestions();
      }
    }
  }

  newestQuestions() {
    // this.state.needRequest = true;
    let func = this.props.showError;
    let phrase = this.props.phrase;
    axios
      .get("http://127.0.0.1:8000/search/newest/" + phrase)
      .then((res) => {
        let qs = this.props.formulateQuestions(res.data);
        this.searchFound = 1;
        this.setState({ questions: qs, phrase: phrase, needRequest: true }); //set questions
      })
      .catch(function (error) {
        if (phrase !== "") func();
      });
  }

  activeQuestions() {
    // this.state.needRequest = true;
    let phrase = this.props.phrase;
    let func = this.props.showError;
    axios
      .get("http://127.0.0.1:8000/search/active/" + phrase)
      .then((res) => {
        let qs = this.props.formulateQuestions(res.data);
        this.setState({ questions: qs, phrase: phrase, needRequest: true }); //set questions
      })
      .catch(function (error) {
        if (phrase !== "") func();
      });
  }

  unansweredQuestions() {
    // this.state.needRequest = true;
    let phrase = this.props.phrase;
    let func = this.props.showError;
    axios
      .get("http://127.0.0.1:8000/search/unanswered/" + phrase)
      .then((res) => {
        let qs = this.props.formulateQuestions(res.data);
        // this.state.questions = qs;
        this.formBatches();
        this.setState({ questions: qs, phrase: phrase, needRequest: true }); //set questions
      })
      .catch(function (error) {
        if (phrase !== "") func();
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

    this.batches = batches;
    // console.log(batches);
  }

  getCorrectBatch() {
    //activities: 0 means current batch, 1 means previous if any, 2 means next if any
    let activity = this.activity;
    // this.state.activity = 0;
    this.activity = 0;
    if (this.state.questions.length === 0) return this.state.questions;
    let currBatchIdx = this.batchIdx;
    let maxBatchIdx = this.batches.length - 1;
    if (
      activity === 0 ||
      (activity === 1 && currBatchIdx === 0) ||
      (activity === 2 && currBatchIdx === maxBatchIdx)
    ) {
      // return this.state.batches[currBatchIdx];
      return this.batches[currBatchIdx];
    } else if (activity === 1) {
      // this.state.batchIdx = --currBatchIdx;
      this.batchIdx = --currBatchIdx;
    } else if (activity === 2) {
      // this.state.batchIdx = ++currBatchIdx;
      this.batchIdx = ++currBatchIdx;
    }

    // return this.state.batches[currBatchIdx];
    return this.batches[currBatchIdx];
  }

  render() {
    const { showAsk } = this.props;
    this.formBatches();
    let questions = this.getCorrectBatch();
    let numQuestions = this.state.questions.length;
    let qStr = "question";
    let result = "";
    if (numQuestions === 0) result = <h3>No Questions Found</h3>;
    if (numQuestions !== 1) qStr += "s";
    // let batchIndex = this.state.batchIdx;
    let batchIndex = this.batchIdx;
    let isLoggedIn;
    if (Cookies.get("user")) {
      isLoggedIn = true;
    }

    return (
      <section>
        <div id="search-body">
          {isLoggedIn && (
            <button
              onClick={() => showAsk()}
              id="askQuestion"
              className="button"
            >
              Ask Question
            </button>
          )}
          <h1 id="allquestions">Search Results</h1>
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
          <div>
            {questions}
            {result}
          </div>
        </div>
      </section>
    );
  }
}
