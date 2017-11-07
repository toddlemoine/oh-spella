import React, { Component } from "react";
import { Observable } from "rxjs/Rx";

class ListBuilder extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    };
  }
  componentDidMount() {
    console.log("initialzing");
    const node = this.node;

    const formSubmit$ = Observable.fromEvent(node, "submit")
      .do(() => console.log("cancel submit"))
      .map(this.cancelSubmit);

    const addNewWord$ = Observable.fromEvent(node, "click")
      .filter(e => e.target.id === "list-builder-add-new-word")
      .do(e => e.preventDefault())
      .do(() => console.log("save current word"))
      .map(e => this.saveCurrentWord(e));

    const removeWord$ = Observable.fromEvent(node, "click")
      .filter(e => e.target.classList.contains("remove-new-word"))
      .pluck("target", "dataset", "index")
      .map(index => this.removeWordAtIndex(index));

    this.unsubscribe = Observable.merge(
      formSubmit$,
      addNewWord$,
      removeWord$
    ).subscribe();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  cancelSubmit(e) {
    e.preventDefault();
  }
  removeWordAtIndex(index) {
    const items = this.state.items.splice(0);
    items.splice(index, 1);
    this.setState({
      items
    });
  }
  saveCurrentWord() {
    const input = this.node.querySelector("#new-word-input");
    const word = input.value;
    input.value = "";
    input.focus();
    this.setState({
      items: this.state.items.concat(word)
    });
  }
  render() {
    const { items = [] } = this.state;
    return (
      <form ref={node => (this.node = node)} className="list-builder">
        <input type="hidden" value={items.join("\t")} />
        <h1>Create new list</h1>
        <div className="field">
          <label htmlFor="new-word-input">Add your word</label>
          <input ref={this.setAddNewWordRef} type="text" id="new-word-input" />
          <button id="list-builder-add-new-word">+</button>
        </div>
        <ul>
          {items.map((item, key) => (
            <li key={key}>
              <span className="new-word">{item}</span>
              <button className="remove-new-word" data-index={key}>
                X
              </button>
            </li>
          ))}
        </ul>
        <div className="field">
          <label htmlFor="list-name">List name (optional)</label>
          <input type="text" id="list-builder-list-name" />
        </div>
        <div className="field">
          <button type="submit" id="list-builder-save">
            Save
          </button>
        </div>
      </form>
    );
  }
}

export default ListBuilder;
