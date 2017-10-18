import React from 'react';

function Form({ letter, onKeyPress }) {
  return (
    <form>
      <label>Press a key</label>
      <input type="text" onKeyPress={onKeyPress} />
      <p>You pressed { letter }</p>
    </form>
  );
}

export default Form;
