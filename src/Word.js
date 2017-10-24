import React from "react";

function Word({ value, wrongLetter }) {
  const classes = ["word", wrongLetter ? "incorrect" : ""].join(" ");
  return <div className={classes}>{value}</div>;
}

export default Word;
