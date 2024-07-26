import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oid: this.props.objId,
      votes: this.props.votes,
    };

    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.objId !== prevProps.objId ||
      this.props.votes !== prevProps.votes
    ) {
      this.setState({ oid: this.props.objId, votes: this.props.votes });
    }
  }

  componentDidMount() {
    // this.updateVote(0);
  }

  updateVote(inc) {
    // if(inc === 0) return;
    let username = Cookies.get("user");
    let data = {
      oid: this.state.oid,
      inc: inc,
      votes: this.state.votes,
      username: username,
    };

    // console.log(this.state.oid);
    let func = this.props.showError;
    axios
      .post("http://127.0.0.1:8000/vote", data)
      .then((res) => {
        if (res.data.cmt === "Reputation problem") {
          document.getElementById(this.state.oid).textContent =
            "*Your reputation is not good. Must be reputation > 50 to vote.";
          // return;
        } else {
          document.getElementById(this.state.oid).textContent = "";
        }

        // console.log("SUBMITTED: " + this.state.value);
        // this.state.comments.push(this.state.value);
        // this.props.rerender();
        // console.log(res.data.votes);'

        this.setState({ votes: res.data.votes });
      })
      .catch(function (error) {
        func();
      });
  }

  upvote() {
    this.updateVote(1);
  }

  downvote() {
    this.updateVote(-1);
  }

  render() {
    let id = this.state.oid;
    let isLoggedIn;
    if (Cookies.get("user")) {
      isLoggedIn = true;
    }

    return (
      <span>
        {isLoggedIn && (
          <button className="reglogbuttonView" onClick={this.upvote}>
            Upvote
          </button>
        )}
        <span id="numVotes">{this.state.votes} votes</span>
        {isLoggedIn && !this.props.comment && (
          <button className="reglogbuttonView" onClick={this.downvote}>
            Downvote
          </button>
        )}
        <br />
        <div
          id={id}
          style={{
            marginLeft: "40%",
            fontSize: "35px",
            color: "red",
            fontStyle: "italic",
            marginTop: "2%",
          }}
        ></div>
        <br />
      </span>
    );
  }
}
