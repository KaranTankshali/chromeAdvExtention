import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainSection from '../components/MainSection';
import SSOLoginSection from '../components/login/ssoLogin';

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    //actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class App extends Component {

  static propTypes = {
    //actions: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="normal">
        <SSOLoginSection/>
      </div>
    );
  }
}
      // <LoginSection/>
      // <MainSection/>
