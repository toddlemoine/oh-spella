import { connect } from "react-redux";
import Form from "./Form";
import { letterPress } from "./letters";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch, ownState) {
  return {
    onKeyPress(e) {
      dispatch(letterPress(e.key));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
