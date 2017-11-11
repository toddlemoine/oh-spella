import React, { Component } from "react";
import { Observable } from "rxjs/Observable";

function setupObservables(node) {
  const input$ = Observable.fromEvent(
    node.querySelector("textarea"),
    "keypress"
  )
    .filter(e => {
      return /[^A-Za-z'!]/.test(e.key);
    })
    .do(e => e.preventDefault())
    .subscribe();
}

class SimpleListBuilderContainer extends Component {
  componentDidMount() {
    setupObservables(this.node);
  }
  handleSubmit() {
    const list = this.listInput.value.split("\n").map(x => x.trim());
    this.props.onSave(null, list);
  }
  render() {
    return (
      <section ref={node => (this.node = node)} className="simple-list-builder">
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

export default SimpleListBuilderContainer;
