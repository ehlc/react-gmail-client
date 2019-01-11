import React, { Component } from "react";
import "./header.scss";
import Signout from "../signout/Signout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchDisabled: false
    }
    this.tempDisableSearch = this.tempDisableSearch.bind(this);
  }

  tempDisableSearch() {
    this.setState({
      searchDisabled: true
    })
  }

  render() {
    const userInfo = this.props.googleUser.w3;
    const email = userInfo.U3;
    const fullName = userInfo.ig;
    const picUrl = userInfo.Paa;

    return (
      <header className="d-flex p-3 align-content-center align-items-center header">
        <div className="header-logo justify-content-center">
          <Link to="/inbox">REACT GMAIL CLIENT</Link>
        </div>

        <div className="header-search">
          <div className="input-group w-75 ml-1 mr-auto">
            <input
              type="search"
              className="form-control border-light"
              placeholder={!this.state.searchDisabled ? "Search mail" : "Search mail feature coming soon!"}
              disabled={this.state.searchDisabled}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              onFocus={this.tempDisableSearch}
            />
            <div className="input-group-append">
              <button
                className="btn btn-light btn-outline-light bg-white text-dark"
                type="button"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
          <div>
            <span className="user-name" title={email}>
              {fullName}
            </span>

            <img className="mx-2 profile-pic" src={picUrl} alt="" />
          </div>
        </div>

        <Signout onSignout={this.props.onSignout} />
      </header>
    );
  }
}

export default Header;
