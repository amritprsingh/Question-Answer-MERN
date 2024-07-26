import React from "react";

export default class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name, qCnt: this.props.qCnt };
    this.displayTags = this.displayTags.bind(this);
  }

  displayTags() {
    let tagName = this.props.name;
    let searchQuery = "[" + tagName + "]";
    this.props.searchUpdate(searchQuery);
  }

  render() {
    let name = this.props.name;
    let qCnt = this.props.qCnt;
    let suffix = "";
    if (qCnt > 1) suffix = "s";
    return (
      <div className="tagElem">
        <div className="tagLink" onClick={this.displayTags}>
          {name}
        </div>
        <div className="tagN">
          {qCnt} question{suffix}
        </div>
      </div>
    );
  }
}
