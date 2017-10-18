export default action$ =>
  action$
    .ofType('LETTERPRESS')
    // .filter(action => action.type === 'LETTERPRESS')
    // do something async here
    .delay(1000)
    .map(action => ({ type: 'LETTERPRESS_COMPLETE', letter: action.letter }));
