import React from "react";
import Word from "./Word";
import NextWordOverlay from "./NextWordOverlay";
import "./Game.css";

function Home({ userWord = "", currentWord = "", complete }) {
  const classes = ["game"];

  return (
    <div className={classes.join(" ")}>
      <NextWordOverlay show={complete} />
      <Word value={currentWord} letters={userWord} />
      (Current word is {currentWord})
      <button id="repeat" disabled={complete}>
        Say Word
      </button>
      <button id="skip" disabled={complete}>
        Skip
      </button>
    </div>
  );
}

export default Home;
