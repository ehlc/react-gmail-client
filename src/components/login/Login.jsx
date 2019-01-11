import React, { Component } from "react";
import GoogleButton from "react-google-button";

export class Login extends Component {

  render() {
    return (
      <div className="d-flex align-content-center align-items-center w-100 h-100 text-center">
        <div className="mx-auto">
          <GoogleButton
            onClick={this.props.onSignIn}
          />
        </div>
      </div>
    );
  }
}

export default Login;
