import React from "react";

function Stats({ stats = [], hidden }) {
  const numberOfWords = stats.length;
  const numberCorrect = stats.filter(x => !x.skipped).length;
  const numberSkipped = stats.filter(x => x.skipped).length;
  const averageTimePerWord = stats
    .map(x => x.end - x.start)
    .reduce((acc, val, index) => {
      if (index === stats.length - 1) {
        return Math.round(acc / stats.length);
      }
      return acc + val;
    }, 0);

  const totalMistakes = stats.reduce((acc, curr) => {
    const numberIncorrect = curr.correctHistory.filter(x => x === false).length;
    acc += numberIncorrect;
    return acc;
  }, 0);

  const mistakesPerWord = totalMistakes / numberOfWords;

  const totalScore = "???";

  return (
    <div className="stats" hidden={hidden}>
      <h1>Stats</h1>
      <ul>
        <li>Number of words: {numberOfWords}</li>
        <li>Words spelled correctly: {numberCorrect}</li>
        <li>Words skipped: {numberSkipped}</li>
        <li>Mistakes per word {mistakesPerWord}</li>
        <li>Avg time per word {averageTimePerWord}</li>
        <li>Total Score: {totalScore}</li>
      </ul>
      <button id="new-game" onClick={() => (window.location.href = "/")}>
        Play New Game
      </button>
    </div>
  );
}

export default Stats;
