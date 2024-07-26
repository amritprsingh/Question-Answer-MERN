import React from "react";

export default class SideBar extends React.Component {
  render() {
    return (
      <span>
        {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
        <a
          onClick={() => this.props.linkClicked(0)}
          id="questionsLink"
          href="#"
        >
          Questions
        </a>
        {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
        <a onClick={() => this.props.linkClicked(1)} id="tagsLink" href="#">
          Tags
        </a>
      </span>
    );
  }
}
