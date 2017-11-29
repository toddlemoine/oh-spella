import React from "react";

export default function SkipButton({ onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}>
      Skip
    </button>
  );
}
