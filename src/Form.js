import React from "react";

function Form({ text, onKeyPress }) {
  return (
    <form>
      <label>Press a key</label>
      <input type="text" onKeyPress={onKeyPress} />
      <p>You pressed {text}</p>
    </form>
  );
}

export default Form;
