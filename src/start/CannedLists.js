import React, { Component } from "react";

function CannedListItem({ value }) {
  return <li>{value}</li>;
}

class CannedLists extends Component {
  render() {
    const { items = [] } = this.props;
    return (
      <ul id="canned-lists" className="canned-lists">
        {items.map((wordSet, index) => (
          <li key={index} data-id={wordSet[0]}>
            {wordSet[1].join(", ")}
          </li>
        ))}
      </ul>
    );
  }
}

export default CannedLists;
