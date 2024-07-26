import React from "react";

export default class TagRow extends React.Component {
  render() {
    const row = this.props.row;
    return <div className="tagRow">{row}</div>;
  }
}
