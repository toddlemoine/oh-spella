export const letterPress = (letter) => {
  return {
    type: 'LETTERPRESS',
    letter
  };
}

export const letterPressComplete = () => {
  return {
    type: 'LETTERPRESS_COMPLETE'
  };
}
