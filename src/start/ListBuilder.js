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
    console.log("initialzing list builder");
    const node = this.node;

    const formSubmit$ = Observable.fromEvent(node, "submit").do(e =>
      e.preventDefault()
    );

    const addNewWord$ = Observable.fromEvent(node, "click")
      .filter(e => e.target.id === "list-builder-add-new-word")
      .map(e => this.saveCurrentWord(e));

    const removeWord$ = Observable.fromEvent(node, "click")
      .filter(e => e.target.classList.contains("remove-new-word"))
      .pluck("target", "dataset", "index")
      .map(index => this.removeWordAtIndex(index));

    const save$ = Observable.fromEvent(
      node.querySelector("#list-builder-save"),
      "click"
    )
      .map(() => this.saveList())
      .do(() => this.setState({ items: [] }))
      .do(() => this.getNewWordInput().focus());

    this.unsubscribe = Observable.merge(
      formSubmit$,
      addNewWord$,
      removeWord$,
      save$
    ).subscribe();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  removeWordAtIndex(index) {
    const items = this.state.items.splice(0);
    items.splice(index, 1);
    this.setState({
      items
    });
  }
  getNewWordInput() {
    return this.node.querySelector("#new-word-input");
  }
  saveCurrentWord() {
    const input = this.getNewWordInput();
    const word = input.value;
    input.value = "";
    input.focus();
    this.setState({
      items: this.state.items.concat(word)
    });
  }
  saveList() {
    const listName = this.node.querySelector("#list-builder-list-name").value;
    this.props.onSave(listName, this.state.items);
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
