import React from "react";
import Tag from "./tag.js";
import TagRow from "./tagRow.js";
import axios from "axios";
import Cookies from "js-cookie";

export default class Tags extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rows: [], numTags: 0 };
  }

  componentDidMount() {
    let func = this.props.showError;
    axios
      .get("http://127.0.0.1:8000/tags")
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

              row.push(
                <Tag
                  key={ind + j}
                  name={name}
                  qCnt={qCnt}
                  showSearch={this.props.showSearch}
                  searchUpdate={this.props.searchUpdate}
                  showError={this.props.showError}
                />
              );

              idx++;
            }

            count += 3;
            ind += 3;
          }

          rows.push(<TagRow key={i} row={row} />);
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
    const showAsk = this.props.showAsk;

    let isLoggedIn = Cookies.get("user");

    return (
      <section>
        <div id="tags-body">
          <div id="topRow">
            <span id="totalTags">{this.state.numTags} Tags</span>

            <span id="allTags">All Tags</span>

            {isLoggedIn && (
              <button
                onClick={() => showAsk()}
                id="askQuestion"
                className="button"
              >
                Ask Question
              </button>
            )}
          </div>

          <div id="mainTag">{this.state.rows}</div>
        </div>
      </section>
    );
  }
}
