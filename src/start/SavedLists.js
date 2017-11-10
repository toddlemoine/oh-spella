import React, { Component } from "react";

class SavedLists extends Component {
  render() {
    const { items = [] } = this.props;
    return (
      <ul id="saved-lists" className="saved-lists">
        {items.map(([id, words], index) => (
          <li key={index} data-id={id}>
            <a href={`/game/saved:${id}`}>{words.join(", ")}</a>
          </li>
        ))}
      </ul>
    );
  }
}

export default SavedLists;
