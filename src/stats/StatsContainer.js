import React, { Component } from "react";
import StatsOverlay from "./StatsOverlay";
import localforage from "../storage";

class StatsContainer extends Component {
  constructor(...args) {
    super();
    this.state = { stats: [] };
  }
  componentWillMount() {
    localforage.getItem(this.props.id).then(stats => this.setState({ stats }));
  }
  render() {
    const { stats } = this.state;
    return <StatsOverlay stats={stats} />;
  }
}

export default StatsContainer;
