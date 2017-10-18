const initialState = {
  letter: ''
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LETTERPRESS':
      return { ...state, letter: action.letter };
    case 'LETTERPRESS_COMPLETE':
      return state;
    default:
      return state;
  }
}

export default appReducer;
