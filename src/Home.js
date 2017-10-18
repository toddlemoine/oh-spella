import { connect } from 'react-redux';
import Form from './Form';
import { letterPress } from './actions';

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    onKeyPress(e) {
      dispatch(letterPress(e.which));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
