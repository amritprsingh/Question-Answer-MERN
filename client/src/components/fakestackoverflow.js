import Home from "./homepage.js";
import Tags from "./tags";
import Ask from "./askQuestion.js";
import View from "./viewQuestion.js";
import Search from "./searchPage.js";
import React from "react";
import Banner from "./banner.js";
import Question from "./question.js";
import Welcome from "./welcome.js";
import Login from "./login.js";
import Register from "./register.js";
import Cookies from "js-cookie";
import Profile from "./profile.js";
import { QuestionProfile, QuestionAnswerProfile } from "./question.js";
import { ProfileQuestion } from "./question.js";
import VerifyDeletion from "./verifyDeletion.js";

export default class FakeStackOverflow extends React.Component {
  constructor(props) {
    super(props);
    const cookieValue = Cookies.get("user");
    let showWValue = true;
    let showHValue = false;
    let logIn = false;
    if (cookieValue) {
      showWValue = false;
      showHValue = true;
      logIn = true;
    }
    this.state = {
      setOnce: 0,
      showW: showWValue, //will be default true
      showL: false,
      showR: false,
      showH: showHValue, //home page -- will be default false
      showT: false, //tags pags
      showA: false, //ask question
      showV: false, //view question
      showS: false, //search page
      showP: false, //post page
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
      userview: "",
      profQuestionShow: null,
      notOriginal: 0,
      loggedIn: logIn, //will be default false
      username: cookieValue || "", //will be default "",
      searchPhrase: "", //for updating search page upon each search
      index: 0,
      answers: [],
      deletionId: "",
      deletionElement: null,
      deletionElementType: -1,
    };
  }

  componentDidMount() {
    if (this.state.showH === true) this.linkClicked(0);
  }

  checkValidCookie() {
    const cookieValue = Cookies.get("user");
    if (!cookieValue) {
      const btn = document.getElementById("logoutBtn");
      if (btn) {
        btn.click();
        alert("Cookie Expired, Please Log In Again");
      }
    }
  }

  setInd = (idx) => {
    this.setState({ index: idx });
  };

  getInd = () => {
    return this.state.index;
  };

  setUserView = (username) => {
    this.setState({ userview: username });
  };

  getUserView = () => {
    return this.state.userview;
  };

  showHome = () => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: true,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
    this.checkValidCookie();
  };

  showAsk = () => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: true,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
    this.checkValidCookie();
  };

  showTags = () => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: true,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
    this.checkValidCookie();
    this.updateSideBar(1);
  };

  showSearch = () => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: true,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
    this.checkValidCookie();

    this.updateSideBar(0);
  };

  showView = (index) => {
    this.checkValidCookie();
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: true,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
    this.checkValidCookie();
    this.linkClicked(-1);
    this.setInd(index);
  };

  showPost = (index) => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: true,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });

    this.linkClicked(-1);
    this.setInd(index);
    this.checkValidCookie();
  };

  showWelcome = () => {
    this.setState({
      showW: true,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
  };

  showLogin = () => {
    this.setState({
      showW: false,
      showL: true,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
  };

  showRegister = () => {
    this.setState({
      showW: false,
      showL: false,
      showR: true,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
    });
  };

  showProfile = (username) => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: true,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: false,
      userview: username,
    });
    this.checkValidCookie();

    this.setUserView(username);
    this.linkClicked(2);
  };

  showOrigProfile = () => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: true,
      showProfQuestion: false,
      verifyDeletion: false,
    });
    this.checkValidCookie();
    this.setUserView(Cookies.get("user"));

    this.linkClicked(2);
  };

  showProfileQuestion = (question) => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: true,
      verifyDeletion: false,
    });
    this.checkValidCookie();
    this.setState({ profQuestionShow: question });
    this.linkClicked(2);
  };

  showVerifyDeletion = (id, element, qOrU) => {
    this.setState({
      showW: false,
      showL: false,
      showR: false,
      showH: false,
      showT: false,
      showA: false,
      showV: false,
      showS: false,
      showP: false,
      showProf: false,
      showOProf: false,
      showProfQuestion: false,
      verifyDeletion: true,
    });
    this.checkValidCookie();
    this.linkClicked(2);
    this.setState({
      deletionId: id,
      deletionElement: element,
      deletionElementType: qOrU,
    });
  };

  setLogIn = (isLoggedIn, username) => {
    this.setState({
      isLoggedIn: isLoggedIn,
      username: username,
    });
    if (!isLoggedIn) {
      this.showWelcome();
      alert("Ended All Sessions!");
    } else {
      this.showHome();
      alert("Started Session!");
    }
  };

  searchUpdate = (phrase) => {
    this.setState({ searchPhrase: phrase });
    this.showSearch();
  };

  showError = () => {
    alert(
      "Server Error : Please Refresh Page + Server and then Advance Next Alert"
    );
    this.setLogIn(false, "");
    Cookies.remove("user");
  };

  formateDate = (askDate) => {
    const date = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let hrs = askDate.getHours();
    hrs = Math.floor(hrs);
    let hrsString = hrs < 10 ? "0" + hrs.toString() : hrs.toString();
    let mins = askDate.getMinutes();
    mins = Math.floor(mins);
    let minsString = mins < 10 ? "0" + mins.toString() : mins.toString();
    if (date.getFullYear() > askDate.getFullYear()) {
      return (
        months[askDate.getMonth()] +
        " " +
        askDate.getDate() +
        ", " +
        askDate.getFullYear() +
        " at " +
        hrsString +
        ":" +
        minsString
      );
    } else {
      const dateDiffMS = date - askDate;
      const dateDiffHours = dateDiffMS / (1000 * 60 * 60);
      if (dateDiffHours >= 24) {
        return (
          months[askDate.getMonth()] +
          " " +
          askDate.getDate() +
          " at " +
          hrsString +
          ":" +
          minsString
        );
      } else if (dateDiffHours >= 1) {
        if (Math.floor(dateDiffHours) === 1) {
          return Math.floor(dateDiffHours) + " hour ago";
        } else {
          return Math.floor(dateDiffHours) + " hours ago";
        }
      } else if (dateDiffMS / (1000 * 60) >= 1) {
        return Math.floor(dateDiffMS / (1000 * 60)) + " minutes ago";
      } else {
        return Math.floor(dateDiffMS / 1000) + " seconds ago";
      }
    }
  };

  findIndices = (t) => {
    let text = t;
    const stack = [];
    const pairs = [];

    for (let i = 0; i < text.length; i++) {
      if (text[i] === "[") {
        stack.push(i);
      } else if (text[i] === "]" && stack.length !== 0) {
        const openIndex = stack.pop();
        pairs.push(openIndex, i);
      }
    }
    let val = this.checkInterval(this.getPairs(text, pairs));

    if (this.errorCheck(val, text) === -1) return -1;

    if (val.length === 0) return "";

    return this.replaceText(text, val);
    //errorCheck
  };

  checkInterval = (intervals) => {
    let final = [];
    while (intervals.length !== 0) {
      let smallestInd = 0;
      let smallestValue = intervals[0];
      for (let i = 0; i < intervals.length; i += 4) {
        if (intervals[i] < smallestValue) {
          smallestInd = i;
          smallestValue = intervals[i];
        }
      }
      final.push(
        intervals[smallestInd],
        intervals[smallestInd + 1],
        intervals[smallestInd + 2],
        intervals[smallestInd + 3]
      );
      let a = intervals[smallestInd];
      let b = intervals[smallestInd + 1];
      intervals.splice(smallestInd, 4);
      for (let i = 0; i < intervals.length; i += 4) {
        if (intervals[i] > a && intervals[i + 1] < b) {
          intervals.splice(i, 4);
          i -= 4;
        }
      }
    }
    return final;
  };

  getPairs = (text, pairs) => {
    let formValid = [];
    for (let i = 0; i < pairs.length; i += 2) {
      if (text.charAt(pairs[i + 1] + 1) === "(") {
        let fnd = 0;
        let indFound = 0;
        for (let j = pairs[i + 1] + 1; j < text.length; j++) {
          if (text.charAt(j) === ")") {
            fnd = 1;
            indFound = j;
            break;
          }
        }
        if (fnd === 1) {
          formValid.push(pairs[i], pairs[i + 1], pairs[i + 1] + 1, indFound);
        }
      } else continue;
    }
    return formValid;
  };

  errorCheck = (valPairs, text) => {
    for (let i = 0; i < valPairs.length; i += 4) {
      if (valPairs[i] + 1 === valPairs[i + 1]) return -1;
      if (valPairs[i + 2] + 1 === valPairs[i + 3]) return -1;
      if (
        !(
          text.substring(valPairs[i + 2] + 1, valPairs[i + 2] + 9) ===
            "https://" ||
          text.substring(valPairs[i + 2] + 1, valPairs[i + 2] + 8) === "http://"
        )
      ) {
        return -1;
      }
    }
  };

  replaceText = (text, val) => {
    let pieces = [];
    let indStart = 0;
    for (let i = 0; i < val.length; i += 4) {
      pieces.push(text.substring(indStart, val[i]));
      pieces.push(" ");
      indStart = val[i + 3] + 1;
    }
    pieces.push(text.substring(indStart, text.length));

    let ind = 1;
    for (let i = 0; i < val.length; i += 4) {
      let name = text.substring(val[i] + 1, val[i + 1]);
      let url = text.substring(val[i + 2] + 1, val[i + 3]);
      pieces[
        ind
      ] = `<a class = "aInText" href="${url}" target="_blank">${name}</a>`;
      ind += 2;
    }

    let final = pieces.join("");
    return final;
  };

  linkClicked = (qOrT) => {
    this.updateSideBar(qOrT);
    if (qOrT === 0) this.showHome();
    if (qOrT === 1) this.showTags();
  };

  updateSideBar = (param) => {
    const x = document.getElementById("questionsLink");
    const y = document.getElementById("tagsLink");
    const z = document.getElementById("profileLink");
    if (param === 0) {
      x.style.backgroundColor = "blue";
      x.style.color = "white";
      y.style.backgroundColor = "rgb(192, 226, 237)";
      y.style.color = "black";
      if (z) {
        z.style.backgroundColor = "rgb(192, 226, 237)";
        z.style.color = "black";
      }
    } else if (param === 1) {
      x.style.backgroundColor = "rgb(192, 226, 237)";
      x.style.color = "black";
      y.style.backgroundColor = "blue";
      y.style.color = "white";
      if (z) {
        z.style.backgroundColor = "rgb(192, 226, 237)";
        z.style.color = "black";
      }
    } else if (param === 2) {
      x.style.backgroundColor = "rgb(192, 226, 237)";
      x.style.color = "black";
      y.style.backgroundColor = "rgb(192, 226, 237)";
      y.style.color = "black";
      if (z) {
        z.style.backgroundColor = "blue";
        z.style.color = "white";
      }
    } else {
      x.style.backgroundColor = "rgb(192, 226, 237)";
      x.style.color = "black";
      y.style.backgroundColor = "rgb(192, 226, 237)";
      y.style.color = "black";
      if (z) {
        z.style.backgroundColor = "rgb(192, 226, 237)";
        z.style.color = "black";
      }
    }
  };

  constructQuestion = (question) => {
    return (
      <Question
        formateDate={this.formateDate}
        key={question.qid}
        id={question.id}
        numAnswers={question.ansIds.length}
        numViews={question.views}
        questionTitle={question.title}
        asker={question.askedBy}
        date={new Date(question.askDate)}
        tags={question.names}
        showView={this.showView}
        numVotes={question.votes}
        showError={this.showError}
      />
    );
  };

  constructProfileQuestion = (question, showDelete) => {
    return (
      <QuestionProfile
        formateDate={this.formateDate}
        key={question.qid}
        id={question.id}
        numAnswers={question.ansIds.length}
        numViews={question.views}
        questionTitle={question.title}
        asker={question.askedBy}
        date={new Date(question.askDate)}
        summary={question.summary}
        text={question.text}
        tagIds={question.tagIds}
        tagnames={question.names}
        showProfileQuestion={this.showProfileQuestion}
        numVotes={question.votes}
        username={this.state.userview}
        question={question}
        showVerifyDeletion={this.showVerifyDeletion}
        showOrigProfile={this.showOrigProfile}
        showDelete={showDelete}
        showError={this.showError}
      />
    );
  };

  constructAnswerProfileQuestion = (question) => {
    return (
      <QuestionAnswerProfile
        formateDate={this.formateDate}
        key={question.qid}
        id={question.id}
        numAnswers={question.ansIds.length}
        numViews={question.views}
        questionTitle={question.title}
        asker={question.askedBy}
        date={new Date(question.askDate)}
        summary={question.summary}
        text={question.text}
        tagIds={question.tagIds}
        tagnames={question.names}
        showProfileQuestion={this.showProfileQuestion}
        numVotes={question.votes}
        username={this.state.userview}
        question={question}
        showView={this.showView}
        showError={this.showError}
      />
    );
  };

  formulateQuestions = (questions) => {
    let updatedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      updatedQuestions.push(this.constructQuestion(questions[i]));
    }

    return updatedQuestions;
  };

  formulateProfileQuestions = (questions, showDelete) => {
    let updatedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      updatedQuestions.push(
        this.constructProfileQuestion(questions[i], showDelete)
      );
    }
    return updatedQuestions;
  };

  formulateAnswerProfileQuestions = (questions) => {
    let updatedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      updatedQuestions.push(this.constructAnswerProfileQuestion(questions[i]));
    }
    return updatedQuestions;
  };

  isHome = () => {
    return this.state.showH;
  };

  render() {
    const {
      showA,
      showH,
      showT,
      showV,
      showS,
      showW,
      showL,
      showR,
      showProf,
      showOProf,
      showProfQuestion,
      verifyDeletion,
    } = this.state;
    return (
      <div>
        <Banner
          showSearchBar={!(showW || showL || showR)}
          showSearch={this.showSearch}
          searchUpdate={this.searchUpdate}
          showLogoutButton={Cookies.get("user")} //will
          showWelcome={this.showWelcome} //after logout
          isHome={this.isHome}
          setLogIn={this.setLogIn} // login is affected (with logout button)
          linkClicked={this.linkClicked}
          showHome={this.showHome}
          showTags={this.showTags}
          showOrigProfile={this.showOrigProfile}
          username={this.state.userview}
          showError={this.showError}
        />

        <div className="main">
          {showW && (
            <Welcome
              showLogin={this.showLogin} //login
              showHome={this.showHome} //guest
              showRegister={this.showRegister} //register
              showError={this.showError}
            />
          )}

          {showR && (
            <Register
              showWelcome={this.showWelcome}
              showLogin={this.showLogin}
              showError={this.showError}
            />
          )}

          {showL && (
            <Login
              showWelcome={this.showWelcome}
              showHome={this.showHome}
              setLogIn={this.setLogIn} //login affected (with login button)
              showError={this.showError}
            />
          )}
          {showH && (
            <Home
              formateDate={this.formateDate}
              showAsk={this.showAsk}
              showView={this.showView}
              formulateQuestions={this.formulateQuestions}
              showWelcome={this.showWelcome} //go back to welcome (if not logged in)
              showError={this.showError}
            />
          )}
          {showT && (
            <Tags
              searchUpdate={this.searchUpdate}
              showAsk={this.showAsk}
              tags={this.props.tags}
              showWelcome={this.showWelcome} //go back to welcome (if not logged in)
              linkClicked={this.linkClicked}
              showError={this.showError}
            />
          )}
          {showA && (
            <Ask
              showHome={this.showHome}
              showAsk={this.showAsk}
              findIndices={this.findIndices}
              updateSideBar={this.updateSideBar}
              showError={this.showError}
            />
          )}
          {showV && (
            <View
              formateDate={this.formateDate}
              showHome={this.showHome}
              showAsk={this.showAsk}
              showTags={this.showTags}
              showView={this.showView}
              showSearch={this.showSearch}
              showPost={this.showPost}
              ind={this.state.index}
              getAnswerComps={this.getAnswerComps}
              findIndices={this.findIndices}
              showError={this.showError}
            />
          )}
          {showS && (
            <Search
              formateDate={this.formateDate}
              phrase={this.state.searchPhrase}
              showAsk={this.showAsk}
              showView={this.showView}
              formulateQuestions={this.formulateQuestions}
              showError={this.showError}
            />
          )}

          {showProf && (
            <Profile
              formateDate={this.formateDate}
              username={this.state.userview}
              showProfile={this.showProfile}
              formulateProfileQuestions={this.formulateProfileQuestions}
              formulateAnswerProfileQuestions={
                this.formulateAnswerProfileQuestions
              }
              showVerifyDeletion={this.showVerifyDeletion}
              showSearch={this.showSearch}
              searchUpdate={this.searchUpdate}
              notOriginal={this.state.notOriginal}
              showTags={this.showTags}
              showError={this.showError}
            />
          )}

          {showOProf && (
            <Profile
              formateDate={this.formateDate}
              username={this.state.userview}
              showProfile={this.showProfile}
              formulateProfileQuestions={this.formulateProfileQuestions}
              formulateAnswerProfileQuestions={
                this.formulateAnswerProfileQuestions
              }
              showVerifyDeletion={this.showVerifyDeletion}
              showSearch={this.showSearch}
              searchUpdate={this.searchUpdate}
              notOriginal={this.state.notOriginal}
              showTags={this.showTags}
              showError={this.showError}
            />
          )}

          {showProfQuestion && (
            <ProfileQuestion
              question={this.state.profQuestionShow}
              username={this.state.userview}
              showProfile={this.showProfile}
              findIndices={this.findIndices}
              showOrigProfile={this.showOrigProfile}
              showError={this.showError}
            />
          )}

          {verifyDeletion && (
            <VerifyDeletion
              deletionId={this.state.deletionId}
              deletionElement={this.state.deletionElement}
              deletionElementType={this.state.deletionElementType}
              formulateProfileQuestions={this.formulateProfileQuestions}
              showProfile={this.showProfile}
              username={this.state.userview}
              showOrigProfile={this.showOrigProfile}
              showError={this.showError}
            />
          )}
        </div>
      </div>
    );
  }
}
