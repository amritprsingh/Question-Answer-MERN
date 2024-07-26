import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Vote from "./voteMechanism";

export default class CommentSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      value: "",
      comments: [],
      // commentsBatches: [],
      commentsBatchIdx: 0,
      // commentsActivity: 0,
      rerender: true,
    };

    // this.state = {
    //   id: props.id,
    //   value: "",
    //   comments: [],
    //   // commentsBatches: [],
    //   commentsBatchIdx: 0,
    //   // commentsActivity: 0,
    // };

    this.commentBatches = [];
    this.commentsBatchIdx = 0;
    this.commentsActivity = 0;

    this.comment = this.comment.bind(this);
    this.prevComment = this.prevComment.bind(this);
    this.nextComment = this.nextComment.bind(this);
  }

  childDemandsRerender() {
    this.setState({ rerender: true });
    // this.forceUpdate();
  }

  componentDidMount() {
    if (!this.state.rerender) return;
    let id = this.props.id;
    axios
      .get("http://127.0.0.1:8000/comments/get/" + id)
      .then((res) => {
        // this.setState({ comments: res.data });
        // let data = res.data;
        // console.log(data);

        this.setState({
          id: this.props.id,
          value: "",
          comments: res.data.comments.reverse(),
          // commentsBatches: [],
          commentsBatchIdx: 0,
          rerender: false,
          // commentsActivity: 0,
        });
      })
      .catch((err) => {
        // this.state = {
        //   id: props.id,
        //   value: "",
        //   comments: [],
        //   // commentsBatches: [],
        //   commentsBatchIdx: 0,
        //   // commentsActivity: 0,
        // };
      });
  }

  comment = () => {
    if (this.state.value.length === 0) {
      // console.log("Nothing to submit.");
      document.getElementById("commentErr").textContent = "Nothing Inputted";
      return;
    }
    // console.log(this.state.id);
    // console.log("SUBMITTED: " + this.state.value);
    // let username = localStorage.getItem("username");
    let username = Cookies.get("user");
    let data = {
      id: this.state.id,
      value: this.state.value,
      username: username,
    };

    // console.log(data);
    let func = this.props.showError;
    axios
      .post("http://127.0.0.1:8000/comment/post", data)
      .then((res) => {
        if (res.data === "TRY AGAIN") {
          document.getElementById("commentErr").textContent =
            "*Unable to comment. Please try again.";
          // return;
        } else if (res.data === "USER REPUTATION") {
          document.getElementById("commentErr").textContent =
            "*Your reputation is not good. Must be reputation > 50 to comment.";
        } else if (res.data === "COMMENT LENGTH") {
          document.getElementById("commentErr").textContent =
            "*Comment must be less than 140 characters. Try again.";
        } else {
          document.getElementById("commentErr").textContent = "";
        }

        // console.log("SUBMITTED: " + this.state.value);
        // this.state.comments.push(this.state.value);
        // this.props.rerender();

        this.setState({ value: "", rerender: true });
        // this.forceUpdate();
      })
      .catch(function (error) {
        func();
      });
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
    // this.state.value = e.target.value;
  };

  formBatches() {
    let comments = this.state.comments;
    // console.log(this.state.comments);
    let numBatches = Math.ceil(comments.length / 3);
    let commentsBatches = [];
    if (numBatches > 0) {
      let idx = 0;
      for (let i = 0; i < numBatches; i++) {
        let batch = [];

        for (let j = 0; j < 3 && idx < comments.length; j++) {
          batch.push(comments[idx++]);
        }

        commentsBatches.push(batch);
      }
    }

    // this.state.commentsBatches = commentsBatches;
    this.commentsBatches = commentsBatches;
    // console.log(commentsBatches);
  }

  getCorrectCommentBatch() {
    //activities: 0 means current batch, 1 means previous if any, 2 means next if any
    // let activity = this.state.commentsActivity;
    let activity = this.commentsActivity;
    // this.state.activity = 0;
    this.activity = 0;
    // let currBatchIdx = this.state.commentsBatchIdx;
    let currBatchIdx = this.commentsBatchIdx;
    // let maxBatchIdx = this.state.commentsBatches.length - 1;
    let maxBatchIdx = this.commentsBatches.length - 1;
    if (maxBatchIdx < 0) maxBatchIdx = 0;
    if (activity === 0 || (activity === 1 && currBatchIdx === 0)) {
      // return this.state.commentsBatches[currBatchIdx];
      return this.commentsBatches[currBatchIdx];
    } else if (activity === 1) {
      --currBatchIdx;
    } else if (activity === 2 && currBatchIdx === maxBatchIdx) {
      currBatchIdx = 0;
      // this.state.commentsBatchIdx = currBatchIdx;
      this.commentsBatchIdx = currBatchIdx;
    } else if (activity === 2) {
      ++currBatchIdx;
    }

    // return this.state.commentsBatches[currBatchIdx];
    // this.setState({ commentsBatchIdx: currBatchIdx });
    this.commentsBatchIdx = currBatchIdx;
    this.setState({ rerender: false });
    // this.forceUpdate();
  }

  prevComment() {
    // this.state.needRequest = false;
    // this.state.commentsActivity = 1;
    this.commentsActivity = 1;
    this.getCorrectCommentBatch();
  }

  nextComment() {
    // this.state.needRequest = false;
    // this.state.commentsActivity = 2;
    this.commentsActivity = 2;
    this.getCorrectCommentBatch();
  }

  render() {
    if (this.state.rerender) this.componentDidMount();
    // let isLoggedIn = localStorage.getItem("isLoggedIn"); //WONT NEED THIS AFTER SESSIONS
    // if(this.state.comments.length > 0) console.log(this.state.comments);
    let isLoggedIn = Cookies.get("user");
    // let comments = this.props.comments;
    this.formBatches();
    let comments = [];
    // let commentsBatches = this.state.commentsBatches;
    let commentsBatches = this.commentsBatches;
    if (commentsBatches !== undefined)
      comments = commentsBatches[this.commentsBatchIdx];
    // comments = commentsBatches[this.state.commentsBatchIdx];
    // let comments = this.state.commentBatches[this.state.commentsBatchIdx];
    // console.log("COMMENTS: ");
    // console.log(comments);
    // console.log("________");
    let commentComponents = [];
    if (comments === undefined || comments.length === 0) {
      if (isLoggedIn)
        commentComponents = <h1>No comments. Be the first to comment!</h1>;
      else
        commentComponents = (
          <h1>No comments. Login & Be the first to comment!</h1>
        );
    } else {
      for (let i = 0; i < comments.length; i++) {
        commentComponents.push(
          <div key={i} className={"comment"}>
            <span id="comment">{comments[i].comment}</span>
            <span id="postedByComment">
              {" "}
              posted by <span id="cUser">{comments[i].username}</span>
            </span>
            <Vote
              votes={comments[i].votes}
              objId={comments[i].cid}
              rerender={this.childDemandsRerender}
              showError={this.props.showError}
              comment={true}
            ></Vote>
          </div>
        );
      }
    }

    // console.log(this.state.comments);
    // console.log(comments);

    return (
      <div>
        <br />
        {/* {this.state.comments.length > 3 && ( */}
        {this.state.comments.length > 3 && (
          <div className="batchSection">
            <button className="reglogbuttonComment" onClick={this.prevComment}>
              Previous Comments
            </button>
            {/* <span id="batchIdx">Page {this.state.commentsBatchIdx + 1}</span> */}
            <span id="batchIdx">Page {this.commentsBatchIdx + 1}</span>
            <button className="reglogbuttonComment" onClick={this.nextComment}>
              Next Comments
            </button>
          </div>
        )}
        <h1 id="commentHeader">Comments:</h1>
        <br></br>
        <div>{commentComponents}</div>

        {isLoggedIn && (
          <span>
            <form onSubmit={this.handleSubmit}>
              <label>
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  className="askQCommentForm"
                />
                {/* <input type="text" value={this.state.value} /> */}
              </label>
              <button type="submit" id="cBtn" onClick={this.comment}>
                Post Comment
              </button>
            </form>
            <div
              id="commentErr"
              style={{
                fontSize: "30px",
                color: "red",
                fontStyle: "italic",
                marginTop: "1%",
              }}
            ></div>
          </span>
        )}
      </div>
    );
  }
}
