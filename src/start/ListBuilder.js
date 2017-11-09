import React, { Component } from "react";
import { Observable, BehaviorSubject } from "rxjs/Rx";

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

    const state$ = new BehaviorSubject({ items: [] })
      .scan((acc, curr = {}) => ({ acc, ...curr }))
      .do(state => console.log("list builder state", state));

    const formSubmit$ = Observable.fromEvent(node, "submit").do(e =>
      e.preventDefault()
    );

    const addNewWord$ = Observable.fromEvent(node, "click")
      .filter(e => e.target.id === "list-builder-add-new-word")
      .map(e => ({ items: this.saveCurrentWord() }));
    // .do(() => this.resetNewWord());

    const removeWord$ = Observable.fromEvent(node, "click")
      .filter(e => e.target.classList.contains("remove-new-word"))
      .pluck("target", "dataset", "index")
      .map(index => ({
        items: this.removeWordAtIndex(index)
      }));

    const save$ = Observable.fromEvent(
      node.querySelector("#list-builder-save"),
      "click"
    )
      .map(() => this.saveList())
      .do(() => this.getNewWordInput().focus())
      .mapTo({ items: [] });

    this.unsubscribe = Observable.merge(
      formSubmit$,
      addNewWord$,
      removeWord$,
      save$
    ).subscribe(state => state$.next(state));

    state$.subscribe(state => this.setState(state));
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  removeWordAtIndex(index) {
    const items = this.state.items.splice(0);
    items.splice(index, 1);
    return items;
  }
  getNewWordInput() {
    return this.node.querySelector("#new-word-input");
  }
  resetNewWord() {
    const input = this.getNewWordInput();
    input.value = "";
    input.focus();
  }
  saveCurrentWord() {
    const input = this.getNewWordInput();
    return this.state.items.concat(input.value);
  }
  saveList() {
    const listName = this.node.querySelector("#list-builder-list-name").value;
    this.props.onSave(listName, this.state.items);
  }
  render() {
    const { items } = this.state;
    return (
      <form ref={node => (this.node = node)} className="list-builder">
        <h1>Create new list</h1>
        <div className="field">
          <label htmlFor="new-word-input">Add your word</label>
          <input type="text" id="new-word-input" />
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
