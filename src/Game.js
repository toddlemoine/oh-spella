import React from "react";
import Word from "./Word";
import NextWordOverlay from "./NextWordOverlay";
import "./Game.css";

function Home({
  userWord = "",
  currentWord = "",
  complete,
  stats = [],
  wordList = []
}) {
  const classes = ["game"];
  const currentStats = stats[stats.length - 1];

  return (
    <div className={classes.join(" ")}>
      <NextWordOverlay show={complete} />
      <Word stats={currentStats} value={currentWord} letters={userWord} />
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
