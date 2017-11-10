import React, { Component } from "react";

class SimpleListBuilder extends Component {
  handleSubmit() {
    const list = this.listInput.value.split("\n").map(x => x.trim());
    this.props.onSave(null, list);
  }
  render() {
    return (
      <section className="simple-list-builder">
        <p>Enter words, one per line.</p>
        <textarea
          id="simple-list-builder-words"
          ref={node => (this.listInput = node)}
        />
        <button data-action="submit" onClick={() => this.handleSubmit()}>
          Go
        </button>
      </section>
    );
  }
}

export default SimpleListBuilder;
