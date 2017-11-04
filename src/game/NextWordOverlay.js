import React from "react";
import "./NextWordOverlay.css";

function NextWordOverlay({ show }) {
  return (
    <div className="next-word-overlay" hidden={!show}>
      <div>
        <p>Hit Space or Click Go for Next Word</p>
        <button id="next-word">Go</button>
      </div>
    </div>
  );
}

export default NextWordOverlay;
