import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import classnames from 'classnames';

import config from '../../config/environment';
import configurations from '../../constants/configurations';
import {ssoLogin} from '../../actions/login';
import style from './ssoLogin.scss';

const mapDispatchToProps = (dispatch) => {
    return {
        ssoLogin: (ssoObject={}) => {
            dispatch(ssoLogin(ssoObject));
        }
    };
};

class SSOLogin extends Component {

    static propTypes = {
        ssoLogin: PropTypes.func.isRequired
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className={style.ssoLogin}
                onClick={this.props.ssoLogin}>Login</div>
        );
    }
}

export default connect(
    undefined,
    mapDispatchToProps
)(SSOLogin);
