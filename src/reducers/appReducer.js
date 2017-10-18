const initialState = {
  letter: ''
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LETTERPRESS_COMPLETE':
      return { ...state, letter: action.letter };
    case 'LETTERPRESS':
      return state;
    default:
      return state;
  }
}

export default appReducer;
