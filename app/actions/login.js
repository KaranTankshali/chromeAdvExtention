import * as types from '../constants/ActionTypes';

export function ssoLogin(obj) {
    console.log('SSO login triggered!');
    return { type: types.SSO_LOGIN, obj };
}