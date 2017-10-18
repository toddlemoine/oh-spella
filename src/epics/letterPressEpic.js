export default letterPressEpic = action$ =>
  action$
    .ofType('LETTERPRESS')
    // .filter(action => action.type === 'LETTERPRESS')
    // do something async here
    .delay(1000)
    .mapTo({ type: 'LETTERPRESS_COMPLETE' });
