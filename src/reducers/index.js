const initialState = {
  words: [],
  currentWord: "",
  userWord: "",
  complete: false,
  stats: []
};

export default function(state = initialState, action) {
  console.log("action", action.type);
  switch (action.type) {
    default:
      return state;
  }
}
