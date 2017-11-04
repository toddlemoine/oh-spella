export function currentStat(stats) {
  return stats[stats.length - 1];
}

export function updateLetterStats(letter, state) {
  const stat = currentStat(state.stats);
  stat.history.push(letter);
}

export function updateCorrectnessStats(correct, state) {
  const stat = currentStat(state.stats);
  stat.correctHistory.push(correct);
}

export function updateCompleteStats(complete, state) {
  const stat = currentStat(state.stats);
  if (complete) {
    stat.end = Date.now();
  }
}

export function updateSkipStats(state) {
  const stat = currentStat(state.stats);
  stat.end = Date.now();
  stat.skipped = true;
}

export function createStats(word) {
  return {
    word,
    history: [],
    correctHistory: [],
    start: Date.now(),
    end: null,
    skipped: false
  };
}
