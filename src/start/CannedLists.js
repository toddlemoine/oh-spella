import React, { Component } from "react";

function CannedListItem({ value }) {
  return <li>{value}</li>;
}

class CannedLists extends Component {
  render() {
    const { items = [] } = this.props;
    return (
      <ul className="canned-lists">
        {items.map((item, index) => <li key={index}>{item.text}</li>)}
      </ul>
    );
  }
}

export default CannedLists;
