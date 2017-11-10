import React from "react";

export default function RemoveItemButton({ className, itemId }) {
  return (
    <button
      className="remove-item-button"
      data-action="remove"
      data-id={itemId}
    >
      &times;
    </button>
  );
}
