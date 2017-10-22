const initialState = {
  letter: ""
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SPEECH_COMPLETE":
      return { ...state, text: action.text };
    case "LETTERPRESS":
      return state;
    default:
      return state;
  }
};

export default appReducer;
