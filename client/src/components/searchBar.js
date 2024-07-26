import React from "react";

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "Search ..." };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      let text = e.target.value;
      // console.log(text);
      this.props.searchUpdate(text);
    }
  }

  render() {
    return (
      <input
        type="text"
        name="search"
        id="search-Bar"
        placeholder={this.state.input}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
