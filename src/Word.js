import React from "react";

function Word({ value }) {
  return (
    <div className="word">
      {value}
      <div className="letters-pressed" />
    </div>
  );
}

export default Word;
