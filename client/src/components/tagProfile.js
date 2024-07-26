import React from "react";

import axios from "axios";

export default class TagsProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rows: [], numTags: 0 };
  }

  componentDidMount() {
    let data = {
      username: this.props.username,
    };
    let func = this.props.showError;
    axios
      .post("http://127.0.0.1:8000/tagsProfile", data)
      .then((res) => {
        let tagsMsg = res.data;
        let numTags = tagsMsg.length;
        const rows = [];
        let numRows = this.getNumRows(tagsMsg);

        let count = 0;
        let ind = 0;
        let idx = 0;
        for (let i = 0; i < numRows; i++) {
          let row = [];
          if (numTags > count) {
            let end = 3;
            if (numTags - count < 3) {
              end = numTags - count;
            }

            for (let j = 0; j < end; j++) {
              let name = tagsMsg[idx].name;
              let qCnt = tagsMsg[idx].refCnt;
              let refUsers = tagsMsg[idx].refUsers;

              row.push(
                <TagProfile
                  key={ind + j}
                  name={name}
                  qCnt={qCnt}
                  showSearch={this.props.showSearch}
                  searchUpdate={this.props.searchUpdate}
                  showTags={this.props.showTags}
                  refUsers={refUsers}
                  showError={this.props.showError}
                />
              );

              idx++;
            }

            count += 3;
            ind += 3;
          }

          rows.push(
            <TagProfileRow showError={this.props.showError} key={i} row={row} />
          );
        }

        this.setState({ rows: rows, numTags: numTags });
      })
      .catch(function (error) {
        func();
      });
  }

  getNumRows(tags) {
    let full = Math.floor(tags.length / 3);
    if (tags.length % 3 !== 0) full++;
    return full;
  }

  render() {
    return (
      <section>
        <div id="tags-body-prof">
          <div id="topRow">
            <span id="totalTags">{this.state.numTags} Tags</span>
            <span id="allTags">All Tags</span>
          </div>
          <div id="mainTagProf">{this.state.rows}</div>
        </div>
      </section>
    );
  }
}

export class TagProfileRow extends React.Component {
  render() {
    const row = this.props.row;
    return <div className="tagRow">{row}</div>;
  }
}

export class TagProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      qCnt: this.props.qCnt,
      edit: true,
      del: false,
      refUsers: this.props.refUsers,
    };
    this.displayTags = this.displayTags.bind(this);
  }

  displayTags() {
    let tagName = this.props.name;
    let searchQuery = "[" + tagName + "]";
    this.props.searchUpdate(searchQuery);
  }

  deleteTag = async () => {
    let data = { name: this.state.name };
    let func = this.props.showError;
    await axios
      .post("http://127.0.0.1:8000/deleteTag", data)
      .then((res) => {})
      .catch(function (error) {
        func();
      });
    this.props.showTags();
  };

  updateTag = async () => {
    let newTag = document.getElementById("inTag").value;
    if (newTag.length > 20) {
      document.getElementById("errTag").innerHTML = "Tag Too Long";
    } else {
      let data = {
        oldTag: this.state.name,
        newTag: newTag,
      };
      let func = this.props.showError;
      await axios
        .post("http://127.0.0.1:8000/updateTag", data)
        .then((res) => {})
        .catch(function (error) {
          func();
        });
      this.props.showTags();
    }
  };

  checkRefUsers() {
    let user = this.state.refUsers[0];
    for (let i = 0; i < this.state.refUsers.length; i++) {
      if (this.state.refUsers[i] !== user) {
        return false;
      }
    }
    return true;
  }

  render() {
    //let ref =
    let ref = this.checkRefUsers();
    let name = this.props.name;
    let qCnt = this.props.qCnt;
    let suffix = "";
    let { del, edit } = this.state;
    if (qCnt > 1) suffix = "s";
    return (
      <span>
        {!del && edit && (
          <div className="tagElemProf">
            <div className="tagLink" onClick={this.displayTags}>
              {name}
            </div>
            <div className="tagN">
              {qCnt} question{suffix}
            </div>
            {ref && (
              <div>
                <button
                  className="tagbtns"
                  onClick={() => {
                    this.setState({ edit: false });
                  }}
                >
                  Edit
                </button>
                <button
                  className="tagbtns"
                  onClick={() => {
                    this.setState({ del: true, edit: false });
                  }}
                >
                  Delete
                </button>
              </div>
            )}
            {!ref && <div id="notedit">Can Not Edit : {">1 user ref"}</div>}
          </div>
        )}
        {!del && !edit && (
          <div className="tagElemProf">
            <div className="tagLink">
              <input id="inTag" type="text" defaultValue={this.props.name} />
            </div>
            <div id="errTag" className="tagN">
              {qCnt} question{suffix}
            </div>
            <div className="tagN">
              <button className="tagbtns" onClick={() => this.updateTag()}>
                Update
              </button>
              <button
                className="tagbtns"
                onClick={() => {
                  this.setState({ edit: true });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {del && !edit && (
          <div className="tagElemProf">
            <div>
              Delete Tag : <span>{this.state.name}?</span>
            </div>
            <div className="tagN">
              {qCnt} question{suffix}
            </div>
            <div className="tagN">
              <button className="tagbtns" onClick={() => this.deleteTag()}>
                Confirm
              </button>
              <button
                className="tagbtns"
                onClick={() => {
                  this.setState({ edit: true, del: false });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </span>
    );
  }
}
