import React from "react";
import CommentSection from "./commentSection";
import axios from "axios";
import Vote from "./voteMechanism";

export default class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: this.props.index,
      ans_by: "",
      ans_date_time: "",
      text: "",
      votes: 0,
      comments: [],
      rerender: true,
    };
  }

  componentDidMount() {
    if (!this.state.rerender) return;
    let func = this.props.showError;
    axios
      .get("http://127.0.0.1:8000/answer/comments", {
        params: {
          comments: JSON.stringify(this.props.comments),
        },
      })
      .then((res) => {
        this.setState({ comments: res.data, rerender: false });
      })
      .catch(function (error) {
        func();
      });
  }

  childDemandsRerender() {
    this.forceUpdate();
  }

  render() {
    let { text, ans_by, date, id, votes } = this.props;
    // console.log(text + " " + ans_by + " " + date + " " + id);
    let dat = this.props.formateDate(new Date(date));

    return (
      <div id="indAnswer">
        <span id="ansText" dangerouslySetInnerHTML={{ __html: text }}></span>
        <span id="userNameAns">
          {ans_by}{" "}
          <span id="askQu">
            asked {dat}
            <br />
          </span>
        </span>

        <br />
        <Vote
          votes={votes}
          objId={id}
          rerender={this.childDemandsRerender}
        ></Vote>

        <CommentSection
          rerender={this.props.rerender}
          // comments={this.state.comments}
          id={id}
          showError={this.showError}
        ></CommentSection>
        <br />
        <hr />
        <br />
      </div>
    );
  }
}
