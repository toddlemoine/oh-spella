import React from "react";
import Word from "./Word";

function Form({ word, onKeyPress }) {
  return (
    <div>
      <Word value={word} />
      <form>
        <label>Press a key</label>
        <input type="text" onKeyPress={onKeyPress} />
      </form>
    </div>
  );
}

export default Form;
