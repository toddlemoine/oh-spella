import React, { Component } from "react";
import RemoveItemButton from "./RemoveItemButton";

function CannedListItem({ value }) {
  return <li>{value}</li>;
}

class CannedLists extends Component {
  render() {
    const { items = [] } = this.props;
    return (
      <ul id="canned-lists" className="canned-lists">
        {items.map(([id, words], index) => (
          <li key={index} data-id={id}>
            <a href={`/game/canned:${id}`}> {words.join(", ")} </a>
            <RemoveItemButton itemId={id} />
          </li>
        ))}
      </ul>
    );
  }
}

export default CannedLists;
