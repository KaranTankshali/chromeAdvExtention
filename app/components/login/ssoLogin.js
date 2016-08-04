import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import config from '../../config/environment';
import configurations from '../../constants/configurations';
import './ssoLogin.scss';

export default class SSOLogin extends Component {

    static propTypes = {};

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="sso-login">Login</div>
        );
    }
}
