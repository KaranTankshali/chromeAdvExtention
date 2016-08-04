import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import MainSection from '../components/MainSection';
import SSOLoginSection from '../components/login/ssoLogin';
import AppStore from '../store/configureStore';
import * as LoginActions from '../actions/login';

const store = AppStore({});

@connect(
    state => ({
      user: state.user
    }),
    dispatch => ({
      actions: bindActionCreators(LoginActions, dispatch)
    })
)

class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired
  };

  render() {
    return (
        <Provider store={store}>
          <div className="normal">
            <MainSection/>
          </div>
        </Provider>
    );
  }
}

export default App;
