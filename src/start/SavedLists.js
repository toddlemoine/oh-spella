import React, { Component } from "react";

class SavedLists extends Component {
  render() {
    const { items = [] } = this.props;
    return (
      <ul className="saved-lists">
        {items.map((item, index) => <li key={index}>{item.text}</li>)}
      </ul>
    );
  }
}

export default SavedLists;
