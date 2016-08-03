import React from 'react';
import _ from 'lodash';
import style from './MainSection.css';

class LoginSection extends React.Component {
  render() {
    return (
      <div className="login-ctn">
        <button className={style.uploadButton} onClick={this.getCall}>GetCall</button>
      </div>
    )
  }

  getCall() {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://d910d658-0d19-4356-95db-7fbe2ee71371.nqa-xb.sprinklr.com/api/builder/content-list", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var resp = JSON.parse(xhr.responseText);
          debugger;
        }
      }
      xhr.send();
  }
}

export default LoginSection;
