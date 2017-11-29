import React from "react";

export default function RepeatButton({ onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      Repeat word
    </button>
  );
}
