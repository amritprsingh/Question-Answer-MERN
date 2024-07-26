import React from "react";
import axios from "axios";
import Answer from "./answer";
import TagsProfile from "./tagProfile";
import Cookies from "js-cookie";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      userType: "",
      reputation: 0,
      questionsAsked: [],
      questionsAnswered: [],
      tagsRef: [],
      dateRegistered: "",
      username: this.props.username,
      allUsers: [],
    };
  }

  componentDidMount() {
    this.getUser(this.state.username);
    this.getAllUsers();
  }

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
        showError={this.props.showError}
      />
    );
  };

  getAnswerComps = (answers) => {
    // console.log("list " + answers);
    let ansComps = [];
    for (let i = 0; i < answers.length; i++) {
      ansComps.push(this.constructAnswer(answers[i], i));
    }

    return ansComps;
  };

  constructUser = (user) => {
    return (
      <Users
        username={user.username}
        email={user.email}
        id={user._id}
        showProfile={this.props.showProfile}
        key={user._id}
        showVerifyDeletion={this.props.showVerifyDeletion}
        originUser={Cookies.get("user")}
        showError={this.props.showError}
      />
    );
  };

  formulateUsers = (users) => {
    let userArr = [];
    for (let i = 0; i < users.length; i++) {
      userArr.push(this.constructUser(users[i]));
    }

    return userArr;
  };

  getAllUsers = async () => {
    let users = [];
    let func = this.props.showError;
    await axios
      .get("http://127.0.0.1:8000/allUsers")
      .then((res) => {
        users = res.data;
      })
      .catch(function (error) {
        func();
      });
    this.setState({ allUsers: users });
  };

  getUser = async (username) => {
    let user;
    let asked;
    let answered;
    let data = {
      user: username,
    };
    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/getUser", data, {
        withCredentials: true,
      })
      .then((res) => {
        user = res.data.user;
        asked = res.data.questionsAsk;
        answered = res.data.questionsAnswer;
      })
      .catch(function (error) {
        func();
      });
    this.setState({
      name: user.name,
      email: user.email,
      userType: user.userType,
      reputation: user.reputation,
      questionsAsked: asked,
      questionsAnswered: answered || [],
      tagsRef: user.tagsRef,
      dateRegistered: user.dateRegistered,
    });
  };

  render() {
    let questions = this.props.formulateProfileQuestions(
      this.state.questionsAsked,
      true
    );
    let answers = this.props.formulateAnswerProfileQuestions(
      this.state.questionsAnswered
    );

    let numQuestions = this.state.questionsAsked.length;
    if (numQuestions === 0) {
      questions = <h1>No Questions Asked</h1>;
    }
    let numAnswers = this.state.questionsAnswered.length;
    if (numAnswers === 0) {
      answers = <h1>No Questions Answered</h1>;
    }

    let admin = this.state.userType === "Admin";
    let allusers;
    if (admin) {
      allusers = this.formulateUsers(this.state.allUsers);
    }

    // let test = this.props.username !== Cookies.get("user");
    if (this.props.notOriginal === 1) this.props.showHome();

    return (
      <section>
        <div id="cont">
          <span id="prof">Profile for {this.state.username}</span>
          <span id="infoRow">
            <span>
              Registered :{" "}
              {this.props.formateDate(new Date(this.state.dateRegistered))}
            </span>
            <span>Reputation: {this.state.reputation}</span>
          </span>
          <div className="questionsProfile">
            <div className="qpTitle">Questions Asked: </div>
            <div className="qpQuestions">{questions}</div>
          </div>
          <div className="answersProfile">
            <div className="qpTitle">Questions Answered: </div>
            <div className="qpQuestions">{answers}</div>
          </div>

          <div className="answersProfile">
            <div className="qpTitle">Shared Tags: </div>
            <TagsProfile
              showSearch={this.props.showSearch}
              searchUpdate={this.props.searchUpdate}
              username={this.state.username}
              showTags={this.props.showTags}
              showError={this.props.showError}
            />
          </div>
        </div>
        {admin && (
          <div className="adminUserBox">
            <div className="answersProfile">
              <div id="aBoxTitle">Admin Controls </div>
              <div className="qpTitle">Users: </div>
              <div className="qpQuestions">{allusers}</div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      email: this.props.email,
      id: this.props.id,
      originUser: this.props.originUser,
    };
  }

  switchUser = () => {
    if (this.props.originUser !== this.props.username)
      this.props.showProfile(this.state.username);
  };
  render() {
    let del = this.props.originUser !== this.props.username;
    return (
      <div id="userCont">
        <div id="usertitle">
          User :{/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
          <a id="userProfile" onClick={() => this.switchUser()}>
            {this.state.username}
          </a>
        </div>
        {del && (
          <button
            id="userbtnprof"
            className="reglogbutton"
            onClick={() =>
              this.props.showVerifyDeletion(
                this.props.username,
                this.props.email,
                2
              )
            }
          >
            Delete User
          </button>
        )}
        <br />
        <hr />
      </div>
    );
  }
}
